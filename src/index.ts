import * as util from 'util';
import * as bignum from 'bignum';

export type CryptoUnitCompatible = CryptoUnit | number | string;

function lpad(value: string, length: number, char: string) {
  const fill = new Array(Math.max(0, length - value.length)).fill(char).join('');
  return fill + value;
}

function rpad(value: string, length: number, char: string) {
  const fill = new Array(Math.max(0, length - value.length)).fill(char).join('');
  return value + fill;
}

/*
  1234
  -1.234
  1.234e3
  -1.234e-3
  -1.234e+3
  1e5

  [
    ,
    '-' | undefined,    // negative
    number | undefined, // whole number
    ,
    number | undefined, // decimal
    ,
    number | undefined  // exponent
  ]
*/
const RX = new RegExp('^(-)?([0-9]*)(\.([0-9]+))?(e([-+]?[0-9]+))?$');
function parseDecimalFormat(value: string): [string, string, string, number | undefined] {
  const match = value.match(RX);

  if (match === null) { throw new Error('Invalid decimal format.') }

  if (match[3] && match[3][0] === 'e') {
    return [
      match[1] || '', // negative
      match[2] || '', // whole
      '', // decimal
      match[4] ? parseInt(match[4], 10) : undefined // exponent
    ];
  }
  return [
    match[1] || '', // negative
    match[2] || '', // whole
    match[4] || '', // decimal
    match[6] ? parseInt(match[6], 10) : undefined // exponent
  ];
}

export class CryptoUnit {
  private value: bignum;

  constructor(value: CryptoUnitCompatible) {
    if (!(this instanceof CryptoUnit)) { return new CryptoUnit(value); }

    if (CryptoUnit.isCryptoUnit(value)) {
      this.value = value.value;
    } else if (util.isString(value)) {
      this.value = new bignum(value, 10);
    } else if (util.isNumber(value)) {
      this.value = new bignum(value);
    } else if (bignum.isBigNum(value)) {
      this.value = value as any;
    } else {
      throw new Error(`Invalid input type passed to new CryptoUnit(...). Must be CryptoUnit | number | string.`);
    }
  }

  static isCryptoUnit(other: any): other is CryptoUnit {
    if (other == null || util.isPrimitive(other)) { return false; }
    return other.constructor.name === 'CryptoUnit';
  }

  static fromDecimal(value: number | string): CryptoUnit {
    if (util.isNumber(value)) { value = value.toString(); }

    let [negative, whole, decimal, exponent] = parseDecimalFormat(value);

    if (exponent) {
      if (exponent < 0) {
        // negative exponent
        // move decimal to the left... move whole to decimal
        whole = lpad(whole, -exponent, '0');
        decimal = whole.slice(exponent) + decimal;
        whole = whole.slice(0, exponent);
      } else if (exponent > 0) {
        // positive exponent
        // move decimal to the right... move decimal to whole
        decimal = rpad(decimal, exponent, '0');
        whole = whole + decimal.slice(0, exponent);
        decimal = decimal.slice(exponent);
      }
    }

    return new CryptoUnit(new bignum(`${negative}${whole}${rpad(decimal, 8, '0')}`, 10) as any);
  }

  static fromBuffer(buffer: Buffer): CryptoUnit {
    return new CryptoUnit(bignum.fromBuffer(buffer) as any);
  }

  static compare(lhs: CryptoUnitCompatible, rhs: CryptoUnitCompatible): number {
    return new CryptoUnit(lhs).compare(rhs);
  }

  static gt(lhs: CryptoUnitCompatible, rhs: CryptoUnitCompatible): boolean {
    return new CryptoUnit(lhs).gt(rhs);
  }

  static gte(lhs: CryptoUnitCompatible, rhs: CryptoUnitCompatible): boolean {
    return new CryptoUnit(lhs).gte(rhs);
  }

  static lt(lhs: CryptoUnitCompatible, rhs: CryptoUnitCompatible): boolean {
    return new CryptoUnit(lhs).lt(rhs);
  }

  static lte(lhs: CryptoUnitCompatible, rhs: CryptoUnitCompatible): boolean {
    return new CryptoUnit(lhs).lte(rhs);
  }

  static random(upperBound: CryptoUnitCompatible): CryptoUnit {
    return new CryptoUnit(new CryptoUnit(upperBound).value.rand() as any);
  }

  private b(value: CryptoUnitCompatible): bignum | number | string {
    return CryptoUnit.isCryptoUnit(value) ? value.value : value as any;
  }

  inspect(): string {
    return `<CryptoUnit ${this.value.toString(10)}>`;
  }

  toString(base?: number): string {
    return this.value.toString(base);
  }

  toDecimalString(): string {
    const str = lpad(this.toString(10), 8, '0');
    const whole = str.slice(0, -8);
    const decimal = str.slice(-8);
    return `${whole ? '' : '0'}${whole}.${decimal}`;
  }

  toNumber(): number {
    return this.value.toNumber();
  }

  toJSON(): string {
    return this.toString(10);
  }

  toBuffer(): Buffer {
    return this.value.toBuffer({ endian: 'big', size: 8 });
  }

  compare(other: CryptoUnitCompatible): number {
    return this.value.cmp(this.b(other));
  }

  plus(other: CryptoUnitCompatible): CryptoUnit {
    return new CryptoUnit(this.value.add(this.b(other)) as any);
  }

  minus(other: CryptoUnitCompatible): CryptoUnit {
    return new CryptoUnit(this.value.sub(this.b(other)) as any);
  }

  times(other: CryptoUnitCompatible): CryptoUnit {
    return new CryptoUnit(this.value.mul(this.b(other)) as any);
  }

  dividedBy(other: CryptoUnitCompatible): CryptoUnit {
    return new CryptoUnit(this.value.div(this.b(other)) as any);
  }

  bitwiseAnd(other: CryptoUnitCompatible): CryptoUnit {
    return new CryptoUnit(this.value.and(this.b(other)) as any);
  }

  bitwiseOr(other: CryptoUnitCompatible): CryptoUnit {
    return new CryptoUnit(this.value.or(this.b(other)) as any);
  }

  bitwiseXor(other: CryptoUnitCompatible): CryptoUnit {
    return new CryptoUnit(this.value.xor(this.b(other)) as any);
  }

  bitshiftLeft(bits: CryptoUnitCompatible): CryptoUnit {
    return new CryptoUnit(this.value.shiftLeft(this.b(bits)) as any);
  }

  bitshiftRight(bits: CryptoUnitCompatible): CryptoUnit {
    return new CryptoUnit(this.value.shiftRight(this.b(bits)) as any);
  }

  mod(other: CryptoUnitCompatible): CryptoUnit {
    return new CryptoUnit(this.value.mod(this.b(other)) as any);
  }

  pow(other: CryptoUnitCompatible): CryptoUnit {
    return new CryptoUnit(this.value.pow(this.b(other)) as any);
  }

  equalTo(other: CryptoUnitCompatible): boolean {
    return this.value.eq(this.b(other));
  }

  gt(other: CryptoUnitCompatible): boolean {
    return this.value.gt(this.b(other));
  }

  greaterThan(other: CryptoUnitCompatible): boolean {
    return this.value.gt(this.b(other));
  }

  gte(other: CryptoUnitCompatible): boolean {
    return this.value.ge(this.b(other));
  }

  greaterThanOrEqualTo(other: CryptoUnitCompatible): boolean {
    return this.value.ge(this.b(other));
  }

  lt(other: CryptoUnitCompatible): boolean {
    return this.value.lt(this.b(other));
  }

  lessThan(other: CryptoUnitCompatible): boolean {
    return this.value.lt(this.b(other));
  }

  lte(other: CryptoUnitCompatible): boolean {
    return this.value.le(this.b(other));
  }

  lessThanOrEqualTo(other: CryptoUnitCompatible): boolean {
    return this.value.le(this.b(other));
  }

  abs(): CryptoUnit {
    return new CryptoUnit(this.value.abs() as any);
  }

  absoluteValue(): CryptoUnit {
    return new CryptoUnit(this.value.abs() as any);
  }

  negate(): CryptoUnit {
    return new CryptoUnit(this.value.neg() as any);
  }
}
