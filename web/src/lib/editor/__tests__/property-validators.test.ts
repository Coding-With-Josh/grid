import {
  StringValidator,
  NumberValidator,
  ColorValidator,
  DimensionValidator,
  ExpressionValidator,
  CompositeValidator,
  createValidator
} from '../property-validators';

describe('StringValidator', () => {
  it('validates string type', () => {
    const validator = new StringValidator();
    expect(validator.validate(42)).toBeTruthy();
    expect(validator.validate('valid')).toBeNull();
  });

  it('validates minLength constraint', () => {
    const validator = new StringValidator(3);
    expect(validator.validate('ab')).toBeTruthy();
    expect(validator.validate('abc')).toBeNull();
    expect(validator.validate('abcd')).toBeNull();
  });

  it('validates maxLength constraint', () => {
    const validator = new StringValidator(undefined, 3);
    expect(validator.validate('abcd')).toBeTruthy();
    expect(validator.validate('abc')).toBeNull();
    expect(validator.validate('ab')).toBeNull();
  });

  it('validates pattern constraint', () => {
    const validator = new StringValidator(undefined, undefined, /^[A-Z]+$/);
    expect(validator.validate('abc')).toBeTruthy();
    expect(validator.validate('ABC')).toBeNull();
  });
});

describe('NumberValidator', () => {
  it('validates number type', () => {
    const validator = new NumberValidator();
    expect(validator.validate('42')).toBeTruthy();
    expect(validator.validate(42)).toBeNull();
  });

  it('validates min constraint', () => {
    const validator = new NumberValidator(0);
    expect(validator.validate(-1)).toBeTruthy();
    expect(validator.validate(0)).toBeNull();
    expect(validator.validate(1)).toBeNull();
  });

  it('validates max constraint', () => {
    const validator = new NumberValidator(undefined, 100);
    expect(validator.validate(101)).toBeTruthy();
    expect(validator.validate(100)).toBeNull();
    expect(validator.validate(99)).toBeNull();
  });

  it('validates step constraint', () => {
    const validator = new NumberValidator(0, 100, 5);
    expect(validator.validate(7)).toBeTruthy();
    expect(validator.validate(5)).toBeNull();
    expect(validator.validate(10)).toBeNull();
  });

  it('validates integer constraint', () => {
    const validator = new NumberValidator(undefined, undefined, undefined, false);
    expect(validator.validate(3.14)).toBeTruthy();
    expect(validator.validate(42)).toBeNull();
  });
});

describe('ColorValidator', () => {
  it('validates color type', () => {
    const validator = new ColorValidator();
    expect(validator.validate(42)).toBeTruthy();
    expect(validator.validate('#fff')).toBeNull();
    expect(validator.validate('#ffffff')).toBeNull();
  });

  it('validates hex format', () => {
    const validator = new ColorValidator();
    expect(validator.validate('#xyz')).toBeTruthy();
    expect(validator.validate('#ff00ff')).toBeNull();
  });

  it('validates rgb format', () => {
    const validator = new ColorValidator();
    expect(validator.validate('rgb(300,0,0)')).toBeTruthy();
    expect(validator.validate('rgb(255,0,0)')).toBeNull();
  });

  it('validates rgba format', () => {
    const validator = new ColorValidator();
    expect(validator.validate('rgba(255,0,0,1.5)')).toBeTruthy();
    expect(validator.validate('rgba(255,0,0,0.5)')).toBeNull();
  });
});

describe('DimensionValidator', () => {
  it('validates dimension type', () => {
    const validator = new DimensionValidator();
    expect(validator.validate(42)).toBeTruthy();
    expect(validator.validate('100px')).toBeNull();
  });

  it('validates units', () => {
    const validator = new DimensionValidator();
    expect(validator.validate('100')).toBeTruthy();
    expect(validator.validate('100px')).toBeNull();
    expect(validator.validate('100%')).toBeNull();
    expect(validator.validate('100vh')).toBeNull();
    expect(validator.validate('100vw')).toBeNull();
    expect(validator.validate('100em')).toBeNull();
    expect(validator.validate('100rem')).toBeNull();
  });

  it('validates numeric values', () => {
    const validator = new DimensionValidator();
    expect(validator.validate('abcpx')).toBeTruthy();
    expect(validator.validate('100.5px')).toBeNull();
    expect(validator.validate('-100px')).toBeNull();
  });
});

describe('ExpressionValidator', () => {
  it('validates expression type', () => {
    const validator = new ExpressionValidator();
    expect(validator.validate(42)).toBeTruthy();
    expect(validator.validate('1 + 1')).toBeNull();
  });

  it('validates javascript syntax', () => {
    const validator = new ExpressionValidator();
    expect(validator.validate('1 +')).toBeTruthy();
    expect(validator.validate('Math.max(1, 2)')).toBeNull();
  });

  it('blocks dangerous expressions', () => {
    const validator = new ExpressionValidator();
    expect(validator.validate('eval("alert(1)")')).toBeTruthy();
    expect(validator.validate('window.location')).toBeTruthy();
    expect(validator.validate('document.cookie')).toBeTruthy();
  });
});

describe('CompositeValidator', () => {
  it('combines multiple validators', () => {
    const validator = new CompositeValidator([
      new StringValidator(3),
      new StringValidator(undefined, 5)
    ]);
    expect(validator.validate('ab')).toBeTruthy();
    expect(validator.validate('abcdef')).toBeTruthy();
    expect(validator.validate('abc')).toBeNull();
  });
});

describe('createValidator', () => {
  it('creates appropriate validator', () => {
    expect(createValidator('string')).toBeInstanceOf(StringValidator);
    expect(createValidator('number')).toBeInstanceOf(NumberValidator);
    expect(createValidator('color')).toBeInstanceOf(ColorValidator);
    expect(createValidator('dimension')).toBeInstanceOf(DimensionValidator);
    expect(createValidator('expression')).toBeInstanceOf(ExpressionValidator);
  });

  it('throws for unknown type', () => {
    expect(() => createValidator('unknown')).toThrow();
  });
});
