include "./ageCheck.circom";
include "./pedersenHash.circom";

template Complete() {
    signal private input birthYear;
    signal private input rand;
    signal input hash[2];
    signal input comparisonYear;
    signal input minimumDifference;
    signal output results;

    signal computedHash[2];
    signal comparisons[2];

    component pedersen = PedersenHash();
    component ageCheck = AgeCheck();

    pedersen.message[0] <== birthYear;
    pedersen.message[1] <== rand;
    computedHash[0] <== pedersen.out[0];
    computedHash[1] <== pedersen.out[1];

    comparisons[0] <--  computedHash[0]==hash[0];
    comparisons[1] <--  computedHash[1]==hash[1];
    
    ageCheck.birthYear <== birthYear;
    ageCheck.comparisonYear <== comparisonYear;
    ageCheck.minimumDifference <== minimumDifference;

    results <-- comparisons[0] * comparisons[0] * ageCheck.results;
}

component main = Complete();