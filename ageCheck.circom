template AgeCheck() {
    signal private input birthYear;
    signal input comparisonYear;
    signal input minimumDifference;
    signal output results;

    results <-- (comparisonYear - birthYear - minimumDifference)>=0 ? 1 : 0;
}

component main = AgeCheck();