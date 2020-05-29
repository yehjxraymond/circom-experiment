# Setup

npm i -g snarkjs
npm i -g circom
npm i


# V1 - Age Check

Code:

```txt
template birthYearCheck() {
    signal private input birthYear;
    signal input comparisonYear;
    signal input minimumDifference;
    signal output results;

    results <-- (comparisonYear - birthYear - minimumDifference)>=0 ? 1 : 0;
}

component main = birthYearCheck();
```

## Running the circuit

### Compile the circuit

```sh
circom birthYearCheck.circom --r1cs --wasm --sym
```

Once the circuit has been compiled, you will see the following files:

- birthYearCheck.r1cs
- birthYearCheck.sym
- birthYearCheck.wasm

### View the circuit cummary:

```sh
snarkjs info -r birthYearCheck.r1cs
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
snarkjs setup -r birthYearCheck.r1cs
```

This will generate the `proving_key.json` and `verification_key.json`, both of which are public keys.

### Calculating witness

Create a file `birthYearCheckInput.json` for the witness:

```json
{
  "a": 1990,
  "b": 2020
}
```

You can calculate the witness with the following:

```sh
snarkjs calculatewitness --wasm birthYearCheck.wasm --input birthYearCheckInput.json --witness birthYearCheckWitness.json
```

### Creating the proof

```sh
snarkjs proof --witness birthYearCheckWitness.json --proof birthYearCheckProof.json --pub birthYearCheckPublic.json
```

### Checking the proof

```sh
snarkjs verify --pub birthYearCheckPublic.json --proof birthYearCheckProof.json
```