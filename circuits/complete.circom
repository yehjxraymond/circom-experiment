include "./ageCheck.circom";
include "./birthYearCheck.circom";

template Complete() {
    signal private input birthYear;
    signal private input rand;
    signal input hash[2];
    signal input comparisonYear;
    signal input minimumDifference;
    signal output results;

    component ageCheck = AgeCheck();
    component birthYearCheck = BirthYearCheck();
    
    ageCheck.birthYear <== birthYear;
    ageCheck.comparisonYear <== comparisonYear;
    ageCheck.minimumDifference <== minimumDifference;

    birthYearCheck.hash[0] <== hash[0];
    birthYearCheck.hash[1] <== hash[1];
    birthYearCheck.rand <== rand;
    birthYearCheck.birthYear <== birthYear;

    results <-- birthYearCheck.results * ageCheck.results;
}

component main = Complete();