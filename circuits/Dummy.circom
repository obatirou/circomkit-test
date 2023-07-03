pragma circom 2.1.2;

template Dummy() {
    signal input p;
    signal input q;

    signal output outP;
    signal output outQ;

    signal beta;

    beta <-- p / q;
    beta * q === p;
    
    outP <== beta * beta - (2 * p);
    outQ <== beta * (p - outP) - q;
}