const fs = require("fs");
const path = require("path");
const zkSnark = require("snarkjs");
const loadR1cs = require("r1csfile").load;
const WitnessCalculatorBuilder = require("circom_runtime")
  .WitnessCalculatorBuilder;
const provingKey = require("../proving_key.json");
const verificationKey = require("../verification_key.json");
const deepMap = require("deep-map");

const bigIntMapper = (val) => {
  if (typeof val === "string" && /^\d+$/.test(val)) {
    return BigInt(val);
  } else {
    return val;
  }
};
const bigInt = (obj) => deepMap(obj, bigIntMapper);

const run = async () => {
  const cir = await loadR1cs(path.join(__dirname, "..", "complete.r1cs"), true);
  //   const setup = zkSnark.groth.setup(cir);
  const wasm = await fs.promises.readFile(
    path.join(__dirname, "..", "complete.wasm")
  );
  const wc = await WitnessCalculatorBuilder(wasm, { sanityCheck: true });
  const witness = await wc.calculateWitness({
    birthYear: 1990,
    rand: 1990,
    hash: [
      "20687928115026053699926515049138692070100647654038300385721779911896219193902",
      "11072087695851230221153980887306278529192602579917930578016623940159289561376",
    ],
    comparisonYear: 2020,
    minimumDifference: 21,
  });
  //   console.log(setup.vk_proof);
  const { proof } = zkSnark.groth.genProof(bigInt(provingKey), witness);
  const publicSignals = [
    "1",
    "20687928115026053699926515049138692070100647654038300385721779911896219193902",
    "11072087695851230221153980887306278529192602579917930578016623940159289561376",
    "2020",
    "21",
  ];
  console.log(proof);
  console.log(publicSignals);
  console.log(
    zkSnark.groth.isValid(bigInt(verificationKey), proof, publicSignals)
  );
};

run();
