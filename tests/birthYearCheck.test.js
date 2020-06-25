const path = require("path");
const tester = require("circom").tester;

describe("birthYearCheck", () => {
  it("should return results 1 when birth year and salt hashes correctly to evidence", async () => {
    const circuit = await tester(
      path.join(__dirname, "..", "circuits", "birthYearCheckMain.circom"),
      { reduceConstraints: false }
    );
    const witness1 = await circuit.calculateWitness({
      birthYear: 1990,
      rand: 1990,
      hash: [
        "20687928115026053699926515049138692070100647654038300385721779911896219193902",
        "11072087695851230221153980887306278529192602579917930578016623940159289561376",
      ],
    });
    await circuit.assertOut(witness1, {
      results: 1,
    });
  });

  it("should return results 0 when birth year and salt hashes does not correctly to evidence", async () => {
    const circuit = await tester(
      path.join(__dirname, "..", "circuits", "birthYearCheckMain.circom"),
      { reduceConstraints: false }
    );
    const witness1 = await circuit.calculateWitness({
      birthYear: 1990,
      rand: 1991,
      hash: [
        "20687928115026053699926515049138692070100647654038300385721779911896219193902",
        "11072087695851230221153980887306278529192602579917930578016623940159289561376",
      ],
    });
    await circuit.assertOut(witness1, {
      results: 0,
    });
  });
});
