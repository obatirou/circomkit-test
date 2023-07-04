pragma circom 2.1.2;

template Dummy() {
    signal input p;
    signal input q;

    signal output outP;
    signal output outQ;

    signal lambda;

    lambda <-- p / q;
    lambda * q === p;
    
    outP <== lambda * lambda - (2 * p);
    outQ <== lambda * (p - outP) - q;
}