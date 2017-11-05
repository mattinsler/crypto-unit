import * as assert from 'assert';
import { CryptoUnit } from './src';

assert.equal('554', new CryptoUnit(554).toString());
assert.equal('-554', new CryptoUnit(-554).toString());
assert.equal('554', new CryptoUnit('554').toString());
assert.equal('-554', new CryptoUnit('-554').toString());

assert.equal('55400000', CryptoUnit.fromDecimal(.554).toString());
assert.equal('55400000', CryptoUnit.fromDecimal('0.554').toString());
assert.equal('15000000000000', CryptoUnit.fromDecimal('1.5e5').toString());
assert.equal('-123400000000', CryptoUnit.fromDecimal(-1.234e+3).toString());
assert.equal('-123400000000', CryptoUnit.fromDecimal(-1.234e3).toString());
assert.equal('-123400000000', CryptoUnit.fromDecimal('-1.234e+3').toString());
assert.equal('-123400000000', CryptoUnit.fromDecimal('-1.234e3').toString());
assert.equal('-123400', CryptoUnit.fromDecimal(-1.234e-3).toString());
assert.equal('-123400', CryptoUnit.fromDecimal('-1.234e-3').toString());
assert.equal('10000000000000', CryptoUnit.fromDecimal('1e5').toString());

for (let x = 0; x < 30; ++x) {
  assert(new CryptoUnit(`1e${x}`).toBuffer() < new CryptoUnit(`2e${x}`).toBuffer());
  assert(new CryptoUnit(`1e${x}`).toBuffer().toString() < new CryptoUnit(`2e${x}`).toBuffer().toString());
}

assert.equal('0.43000000', CryptoUnit.fromDecimal(.43).toDecimalString());
assert.equal('430.00000000', CryptoUnit.fromDecimal(430).toDecimalString());

assert(new CryptoUnit(123).equalTo(123));
assert(new CryptoUnit(123).equalTo('123'));
assert(new CryptoUnit(123).equalTo(new CryptoUnit(123)));
assert.deepEqual(new CryptoUnit(123), CryptoUnit.fromBuffer(new CryptoUnit(123).toBuffer()));
assert.deepEqual(CryptoUnit.fromDecimal(123), CryptoUnit.fromBuffer(new CryptoUnit(12300000000).toBuffer()));

assert(CryptoUnit.max(1, CryptoUnit.fromDecimal('3.22'), 3).equalTo(322000000));
assert(CryptoUnit.min(1, CryptoUnit.fromDecimal('3.22'), 3).equalTo(1));

// plus

assert.equal(
  CryptoUnit.fromDecimal(10).toString(),
  CryptoUnit.fromDecimal(5).plus(CryptoUnit.fromDecimal(5)).toString()
);

assert.equal(
  CryptoUnit.fromDecimal(10).toString(),
  CryptoUnit.fromDecimal(9.005).plus(CryptoUnit.fromDecimal(.995)).toString()
);

// minus

assert.equal(
  CryptoUnit.fromDecimal(10).toString(),
  CryptoUnit.fromDecimal(100).minus(CryptoUnit.fromDecimal(90)).toString()
);

assert.equal(
  CryptoUnit.fromDecimal(10).toString(),
  CryptoUnit.fromDecimal(10.000001).minus(CryptoUnit.fromDecimal(.000001)).toString()
);

// times

assert.equal(
  CryptoUnit.fromDecimal(10).toString(),
  CryptoUnit.fromDecimal(100).times(CryptoUnit.fromDecimal(0.1)).toString()
);

// dividedBy

assert.equal(
  CryptoUnit.fromDecimal(10).toString(),
  CryptoUnit.fromDecimal(100).dividedBy(CryptoUnit.fromDecimal(10)).toString()
);

assert.equal(
  CryptoUnit.fromDecimal(1000).toString(),
  CryptoUnit.fromDecimal(100).dividedBy(CryptoUnit.fromDecimal(0.1)).toString()
);

assert.equal(
  CryptoUnit.fromDecimal(.00031999).toString(),
  CryptoUnit.fromDecimal(3.19999999).dividedBy(CryptoUnit.fromDecimal(10000)).toString()
);

assert.equal(
  CryptoUnit.fromDecimal(.00000319).toString(),
  CryptoUnit.fromDecimal(0.03199999).dividedBy(CryptoUnit.fromDecimal(10000)).toString()
);
