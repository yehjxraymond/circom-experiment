const path = require("path");
const tester = require("circom").tester;

describe("complete", () => {
  it("should return 1 when person is above minimum age", async () => {
    const circuit = await tester(
      path.join(__dirname, "..", "circuits", "complete.circom"),
      { reduceConstraints: false }
    );
    const witness1 = await circuit.calculateWitness({
      birthYear: 1990,
      rand: 1990,
      hash: [
        "20687928115026053699926515049138692070100647654038300385721779911896219193902",
        "11072087695851230221153980887306278529192602579917930578016623940159289561376",
      ],
      comparisonYear: 2020,
      minimumDifference: 21,
    });
    await circuit.assertOut(witness1, {
      results: 1,
    });
  });

  it("should return 1 when person is at minimum age", async () => {
    const circuit = await tester(
      path.join(__dirname, "..", "circuits", "complete.circom"),
      { reduceConstraints: false }
    );
    const witness1 = await circuit.calculateWitness({
      birthYear: 1990,
      rand: 1990,
      hash: [
        "20687928115026053699926515049138692070100647654038300385721779911896219193902",
        "11072087695851230221153980887306278529192602579917930578016623940159289561376",
      ],
      comparisonYear: 2020,
      minimumDifference: 30,
    });
    await circuit.assertOut(witness1, {
      results: 1,
    });
  });

  it("should return 0 when person changes rand", async () => {
    const circuit = await tester(
      path.join(__dirname, "..", "circuits", "complete.circom"),
      { reduceConstraints: false }
    );
    const witness1 = await circuit.calculateWitness({
      birthYear: 1990,
      rand: 0,
      hash: [
        "20687928115026053699926515049138692070100647654038300385721779911896219193902",
        "11072087695851230221153980887306278529192602579917930578016623940159289561376",
      ],
      comparisonYear: 2020,
      minimumDifference: 21,
    });
    await circuit.assertOut(witness1, {
      results: 0,
    });
  });

  it("should return 0 when person cheats on birthYear", async () => {
    const circuit = await tester(
      path.join(__dirname, "..", "circuits", "complete.circom"),
      { reduceConstraints: false }
    );
    const witness1 = await circuit.calculateWitness({
      birthYear: 1991,
      rand: 1990,
      hash: [
        "20687928115026053699926515049138692070100647654038300385721779911896219193902",
        "11072087695851230221153980887306278529192602579917930578016623940159289561376",
      ],
      comparisonYear: 2020,
      minimumDifference: 21,
    });
    await circuit.assertOut(witness1, {
      results: 0,
    });
  });

  it("should return 0 when person is less than minimum age", async () => {
    const circuit = await tester(
      path.join(__dirname, "..", "circuits", "complete.circom"),
      { reduceConstraints: false }
    );
    const witness1 = await circuit.calculateWitness({
      birthYear: 1990,
      rand: 1990,
      hash: [
        "20687928115026053699926515049138692070100647654038300385721779911896219193902",
        "11072087695851230221153980887306278529192602579917930578016623940159289561376",
      ],
      comparisonYear: 2020,
      minimumDifference: 31,
    });
    await circuit.assertOut(witness1, {
      results: 0,
    });
  });
});
