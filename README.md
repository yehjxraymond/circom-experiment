# Rationale

This experiment aims to apply Zero-Knowledge Proof to verify that a person is above the legal age, based on his government issued document, without revealing the actual age of the subject.

## Quick Demo

Simon has been issued his ID with evidence of his birth year by his government. The evidence field has the value `0x2dbcf3ce17a38250f1e88cac9e0f5e41f1eacac7f7182bbd9b431fc3a583122e187a945dd2f2e92b2659e75ed98cbb220246d3906c80ee3e6c0b5480a90e1120`.

With that value, we want to prove that Simon is above the legal age of 21, without revealing his actual age.

At the convenient store, the cashier wants to verify that Simon of legal age before he can buy alcohol. So the cashier wants Simon to prove that he is above age `21` in the year `2020` (let's assume the cashier isn't sticky with month).

To provide the proof, Simon generate a proof with following public parameter:

- Evidence of age: `0x2dbcf3ce17a38250f1e88cac9e0f5e41f1eacac7f7182bbd9b431fc3a583122e187a945dd2f2e92b2659e75ed98cbb220246d3906c80ee3e6c0b5480a90e1120`
- Year to compare: `2020`
- Minimum age: `21`

Together with the public parameters, Simon also used some secret parameters only known to him to generate the proof:

- Birth year
- Secret salt

Once the proof has been generated, Simon passes the following proof to the cashier:

```json
([
  "0x1eb8b746112d774607f04691d704abc99562054c5c674f1a05e22c458406e662",
  "0x012405ac1fd8dd0de7997267b372504ae9025793199647782312b2b629304d82"
],
[
  [
    "0x18515c1ad287045f799ad1bb4d66d74172066c9df408a6001b9acaf12e031a6d",
    "0x302b00fe2059d556f535611bc91d928db6640873e836623e571607802458adfb"
  ],
  [
    "0x0e2c8b8a4a665e121d60d48dbd49a6e369a5823662efad39ed5a9a81d4f8843f",
    "0x0084894a116a604b5c215ebdd3ff1c43cf145e9655b93a8cee61ce11cd73fdf1"
  ]
],
[
  "0x09576aa103f50fc4c0850142e52bee8d6426ba69c4a4df4e244eda62f4ee0043",
  "0x2141bcb34f2cf442c8cb0f3ecf7e85c637824a6de6f4d3282fce14dc1b5177a8"
],
[
  "0x0000000000000000000000000000000000000000000000000000000000000001",
  "0x2dbcf3ce17a38250f1e88cac9e0f5e41f1eacac7f7182bbd9b431fc3a583122e",
  "0x187a945dd2f2e92b2659e75ed98cbb220246d3906c80ee3e6c0b5480a90e1120",
  "0x00000000000000000000000000000000000000000000000000000000000007e4",
  "0x0000000000000000000000000000000000000000000000000000000000000015"
])
```

From the inputs (last array), we can see the following:

1. Valid = true
1. First half of the evidence (`0x2dbcf3ce17a38250f1e88cac9e0f5e41f1eacac7f7182bbd9b431fc3a583122e`)
1. Second half of the evidence (`0x187a945dd2f2e92b2659e75ed98cbb220246d3906c80ee3e6c0b5480a90e1120`)
1. Year, 2020 (`0x07e4`)
1. Minimum age, 21 (`0x15`)

together with some proofs, denoted by `a`, `b` & `c` (first 3 arrays)

With the proof, we can verify the validity by checking it against the verification software. In this case, we are hosting the verification code on Ethereum as a smart contract. So we posted the above proof to the smart contract at [0x161151c4325Dee7935Da16aD65884a7738fA80D3](https://ropsten.etherscan.io/address/0x161151c4325Dee7935Da16aD65884a7738fA80D3)

This system uses two high level constraints:

1. Simon cannot cheat on this birth year. He cannot use any other years to generate a valid proof against the evidence published by his government.
1. Using that same birth year, we verify that `comparisonYear` - `birthYear` >= `minimumAge` holds.

## Setup

```sh
npm i -g snarkjs
npm i -g circom
npm i
```

## Running the circuit

### Compile the circuit

```sh
circom circuits/complete.circom --r1cs --wasm --sym
```

Once the circuit has been compiled, you will see the following files:

- complete.r1cs
- complete.sym
- complete.wasm

### View the circuit cummary:

```sh
snarkjs info -r complete.r1cs
```

You will see the following output for the circuit:

```txt
# Wires: 717
# Constraints: 708
# Private Inputs: 2
# Public Inputs: 4
# Outputs: 1
```

### Setup

```sh
snarkjs setup -r complete.r1cs
```

This will generate the `proving_key.json` and `verification_key.json`, both of which are public keys.

### Calculating witness

Create a file `completeInput.json` for the witness:

```json
{
  "birthYear": 1990,
  "rand": 1990,
  "hash": [
    "20687928115026053699926515049138692070100647654038300385721779911896219193902",
    "11072087695851230221153980887306278529192602579917930578016623940159289561376"
  ],
  "comparisonYear": 2020,
  "minimumDifference": 21
}
```

You can calculate the witness with the following:

```sh
snarkjs calculatewitness --wasm complete.wasm --input completeInput.json --witness completeWitness.json
```

### Creating the proof

```sh
snarkjs proof --witness completeWitness.json --proof completeProof.json --pub completePublic.json
```

### Checking the proof

```sh
snarkjs verify --pub completePublic.json --proof completeProof.json
```

### Generating solidity verifier

```sh
snarkjs generateverifier
```

### Verifying the proof on-chain

```sh
snarkjs generatecall
```

```json
([
  "0x1eb8b746112d774607f04691d704abc99562054c5c674f1a05e22c458406e662",
  "0x012405ac1fd8dd0de7997267b372504ae9025793199647782312b2b629304d82"
],
[
  [
    "0x18515c1ad287045f799ad1bb4d66d74172066c9df408a6001b9acaf12e031a6d",
    "0x302b00fe2059d556f535611bc91d928db6640873e836623e571607802458adfb"
  ],
  [
    "0x0e2c8b8a4a665e121d60d48dbd49a6e369a5823662efad39ed5a9a81d4f8843f",
    "0x0084894a116a604b5c215ebdd3ff1c43cf145e9655b93a8cee61ce11cd73fdf1"
  ]
],
[
  "0x09576aa103f50fc4c0850142e52bee8d6426ba69c4a4df4e244eda62f4ee0043",
  "0x2141bcb34f2cf442c8cb0f3ecf7e85c637824a6de6f4d3282fce14dc1b5177a8"
],
[
  "0x0000000000000000000000000000000000000000000000000000000000000001",
  "0x2dbcf3ce17a38250f1e88cac9e0f5e41f1eacac7f7182bbd9b431fc3a583122e",
  "0x187a945dd2f2e92b2659e75ed98cbb220246d3906c80ee3e6c0b5480a90e1120",
  "0x00000000000000000000000000000000000000000000000000000000000007e4",
  "0x0000000000000000000000000000000000000000000000000000000000000015"
])
```
