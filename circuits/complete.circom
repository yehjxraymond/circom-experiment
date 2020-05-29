include "../node_modules/circomlib/circuits/pedersen.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

template PedersenHash() {
    signal private input message[2];
    signal output out[2];
    
    component pedersen = Pedersen(256);
    component inputBits[2] = Num2Bits(128);

    inputBits[0].in <== message[0];
    inputBits[1].in <== message[1];

    for(var i=0; i<128; i++){
        pedersen.in[i] <== inputBits[0].out[i];
        pedersen.in[i+128] <== inputBits[1].out[i];
    }

    out[0] <== pedersen.out[0];
    out[1] <== pedersen.out[1];
}

template AgeCheck() {
    signal private input birthYear;
    signal input comparisonYear;
    signal input minimumDifference;
    signal output results;

    results <-- (comparisonYear - birthYear - minimumDifference)>=0 ? 1 : 0;
}

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