import * as assert from 'assert';
import { CryptoUnit } from './dist';

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
