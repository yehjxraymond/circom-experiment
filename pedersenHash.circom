include "./node_modules/circomlib/circuits/pedersen.circom";
include "./node_modules/circomlib/circuits/bitify.circom";

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

component main = PedersenHash();