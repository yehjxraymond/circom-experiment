include "./pedersenHash.circom";

template BirthYearCheck() {
    signal private input birthYear;
    signal private input rand;
    signal input hash[2];
    signal output results;

    signal computedHash[2];
    signal comparisons[2];

    component pedersen = PedersenHash();

    pedersen.message[0] <== birthYear;
    pedersen.message[1] <== rand;
    computedHash[0] <== pedersen.out[0];
    computedHash[1] <== pedersen.out[1];

    comparisons[0] <--  computedHash[0]==hash[0];
    comparisons[1] <--  computedHash[1]==hash[1];

    results <-- comparisons[0] * comparisons[0];
}
