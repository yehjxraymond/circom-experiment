const path = require("path");
const tester = require("circom").tester;

describe("ageCheck", () => {
  it("should return results 1 when the age is above the restriction age", async () => {
    const circuit = await tester(
      path.join(__dirname, "..", "circuits", "ageCheck.circom"),
      { reduceConstraints: false }
    );
    const witness1 = await circuit.calculateWitness({
      birthYear: 1990,
      comparisonYear: 2020,
      minimumDifference: 21,
    });
    await circuit.assertOut(witness1, { results: 1 });
  });

  it("should return results 1 when the age is equal the restriction age", async () => {
    const circuit = await tester(
      path.join(__dirname, "..", "circuits", "ageCheck.circom"),
      { reduceConstraints: false }
    );
    const witness1 = await circuit.calculateWitness({
      birthYear: 1999,
      comparisonYear: 2020,
      minimumDifference: 21,
    });
    await circuit.assertOut(witness1, { results: 1 });
  });

  it("should return results 0 when the age is less the restriction age", async () => {
    const circuit = await tester(
      path.join(__dirname, "..", "circuits", "ageCheck.circom"),
      { reduceConstraints: false }
    );
    const witness1 = await circuit.calculateWitness({
      birthYear: 2000,
      comparisonYear: 2020,
      minimumDifference: 21,
    });
    await circuit.assertOut(witness1, { results: 0 });
  });
});
