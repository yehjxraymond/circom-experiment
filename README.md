# V1 - Age Check

Code:

```txt
template AgeCheck() {
    signal private input birthYear;
    signal input comparisonYear;
    signal input minimumDifference;
    signal output results;

    results <-- (comparisonYear - birthYear - minimumDifference)>=0 ? 1 : 0;
}

component main = AgeCheck();
```

## Running the circuit

### Compile the circuit

```sh
circom ageCheck.circom --r1cs --wasm --sym
```

Once the circuit has been compiled, you will see the following files:

- ageCheck.r1cs
- ageCheck.sym
- ageCheck.wasm

### View the circuit cummary:

```sh
snarkjs info -r ageCheck.r1cs
```

You will see the following output for the circuit:

```txt
# Wires: 5
# Constraints: 0
# Private Inputs: 1
# Public Inputs: 2
# Outputs: 1
```

### Setup

```sh
snarkjs setup -r ageCheck.r1cs
```

This will generate the `proving_key.json` and `verification_key.json`, both of which are public keys.

### Calculating witness

Create a file `ageCheckInput.json` for the witness:

```json
{
  "birthYear": 1990,
  "comparisonYear": 2020,
  "minimumDifference": 21
}
```

You can calculate the witness with the following:

```sh
snarkjs calculatewitness --wasm ageCheck.wasm --input ageCheckInput.json --witness ageCheckWitness.json
```

This will generate the following witness file:

```json
["1", "1", "2020", "21", "1990"]
```

### Creating the proof

```sh
snarkjs proof --witness ageCheckWitness.json --proof ageCheckProof.json --pub ageCheckPublic.json
```

### Checking the proof

```sh
snarkjs verify --pub ageCheckPublic.json --proof ageCheckProof.json
```
