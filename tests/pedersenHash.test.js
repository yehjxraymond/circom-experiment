const path = require("path");
const tester = require("circom").tester;

describe("pedersenHash", () => {
  it("should return the hash given two 128 bit inputs", async () => {
    const circuit = await tester(
      path.join(__dirname, "..", "circuits", "pedersenHashMain.circom"),
      { reduceConstraints: false }
    );
    const witness1 = await circuit.calculateWitness({
      message: [1990, 1990],
    });
    await circuit.assertOut(witness1, {
      out: [
        "20687928115026053699926515049138692070100647654038300385721779911896219193902",
        "11072087695851230221153980887306278529192602579917930578016623940159289561376",
      ],
    });
  });
});
