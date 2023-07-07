import {Circomkit, WitnessTester} from '../src';

describe('witness tester', () => {
  // input signals and output signals can be given as type parameters
  // this makes all functions type-safe!
  let circuit: WitnessTester<['p', 'q'], ['outP', 'outQ']>;

  before(async () => {
    const circomkit = new Circomkit();
    circuit = await circomkit.WitnessTester('Dummy', {
      file: 'Dummy',
      template: 'Dummy',
    });
  });

  it('should pass on correct witness with inputs=(0,0)', async () => {
    const witness = await circuit.calculateWitness({p: BigInt(0), q: BigInt(0)});
    await circuit.expectConstraintPass(witness);
    await circuit.assertOut(witness, {outP: BigInt(0), outQ: BigInt(0)});
  });

  it('should pass on correct witness with inputs=(2,2)', async () => {
    const witness = await circuit.calculateWitness({p: BigInt(2), q: BigInt(2)});
    await circuit.expectConstraintPass(witness);
  });

  it('should pass not pass on fake witness for lambda=prime with inputs=(2,2)', async () => {
    const witness = await circuit.calculateWitness({p: BigInt(2), q: BigInt(2)});
    const badWitness = await circuit.editWitness(witness, {
      'main.lambda': BigInt('21888242871839275222246405745257275088548364400416034343698204186575808495617'),
    });
    await circuit.expectConstraintFail(badWitness);
  });

  it('should pass not pass on fake witness for any lambda value with inputs=(2,2)', async () => {
    const witness = await circuit.calculateWitness({p: BigInt(2), q: BigInt(2)});
    const badWitness = await circuit.editWitness(witness, {
      'main.lambda': BigInt('789'),
    });
    await circuit.expectConstraintFail(badWitness);
  });

  it('should pass on fake witness with lambda=prime with (0,0) input', async () => {
    const witness = await circuit.calculateWitness({p: BigInt(0), q: BigInt(0)});
    const badWitness = await circuit.editWitness(witness, {
      'main.lambda': BigInt('21888242871839275222246405745257275088548364400416034343698204186575808495617'),
    });
    await circuit.assertOut(badWitness, {outP: BigInt(0), outQ: BigInt(0)});
    await circuit.expectConstraintPass(badWitness);
  });

  it('should pass on fake witness with any lambda value with (0,0) input', async () => {
    const witness = await circuit.calculateWitness({p: BigInt(0), q: BigInt(0)});
    const badWitness = await circuit.editWitness(witness, {
      'main.lambda': BigInt('1'),
      'main.outP': BigInt('1'),
      'main.outQ': BigInt('21888242871839275222246405745257275088548364400416034343698204186575808495616'),
    });
    await circuit.assertOut(badWitness, {
      outP: BigInt('1'),
      outQ: BigInt('21888242871839275222246405745257275088548364400416034343698204186575808495616'),
    });
    await circuit.expectConstraintPass(badWitness);
  });
});
