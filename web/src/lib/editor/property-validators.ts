import { PropertyValue } from './property-system';

// Validation error interface
export interface ValidationError {
  propertyName: string;
  message: string;
  value: PropertyValue;
  constraint?: any;
}

// Base validator interface
export interface PropertyValidator {
  validate(value: PropertyValue): ValidationError | null;
}

// String validators
export class StringValidator implements PropertyValidator {
  constructor(
    private minLength?: number,
    private maxLength?: number,
    private pattern?: RegExp
  ) {}

  validate(value: PropertyValue): ValidationError | null {
    if (typeof value !== 'string') {
      return {
        propertyName: 'string',
        message: 'Value must be a string',
        value
      };
    }

    if (this.minLength !== undefined && value.length < this.minLength) {
      return {
        propertyName: 'string',
        message: `String must be at least ${this.minLength} characters`,
        value,
        constraint: this.minLength
      };
    }

    if (this.maxLength !== undefined && value.length > this.maxLength) {
      return {
        propertyName: 'string',
        message: `String must be at most ${this.maxLength} characters`,
        value,
        constraint: this.maxLength
      };
    }

    if (this.pattern && !this.pattern.test(value)) {
      return {
        propertyName: 'string',
        message: 'String does not match required pattern',
        value,
        constraint: this.pattern
      };
    }

    return null;
  }
}

// Number validators
export class NumberValidator implements PropertyValidator {
  constructor(
    private min?: number,
    private max?: number,
    private step?: number,
    private allowFloat: boolean = true
  ) {}

  validate(value: PropertyValue): ValidationError | null {
    if (typeof value !== 'number') {
      return {
        propertyName: 'number',
        message: 'Value must be a number',
        value
      };
    }

    if (!this.allowFloat && !Number.isInteger(value)) {
      return {
        propertyName: 'number',
        message: 'Value must be an integer',
        value
      };
    }

    if (this.min !== undefined && value < this.min) {
      return {
        propertyName: 'number',
        message: `Value must be at least ${this.min}`,
        value,
        constraint: this.min
      };
    }

    if (this.max !== undefined && value > this.max) {
      return {
        propertyName: 'number',
        message: `Value must be at most ${this.max}`,
        value,
        constraint: this.max
      };
    }

    if (this.step !== undefined) {
      const isMultipleOfStep = (value - (this.min ?? 0)) % this.step === 0;
      if (!isMultipleOfStep) {
        return {
          propertyName: 'number',
          message: `Value must be a multiple of ${this.step}`,
          value,
          constraint: this.step
        };
      }
    }

    return null;
  }
}

// Color validator
export class ColorValidator implements PropertyValidator {
  private readonly hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  private readonly rgbPattern = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/;
  private readonly rgbaPattern = /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([01]|0?\.\d+)\)$/;

  validate(value: PropertyValue): ValidationError | null {
    if (typeof value !== 'string') {
      return {
        propertyName: 'color',
        message: 'Color value must be a string',
        value
      };
    }

    const isValidHex = this.hexPattern.test(value);
    const isValidRgb = this.rgbPattern.test(value);
    const isValidRgba = this.rgbaPattern.test(value);

    if (!isValidHex && !isValidRgb && !isValidRgba) {
      return {
        propertyName: 'color',
        message: 'Invalid color format. Must be hex, rgb, or rgba',
        value
      };
    }

    if (isValidRgb || isValidRgba) {
      const values = value.match(/\d+/g)!.map(Number);
      const [r, g, b] = values;
      
      if (r > 255 || g > 255 || b > 255) {
        return {
          propertyName: 'color',
          message: 'RGB values must be between 0 and 255',
          value
        };
      }

      if (isValidRgba) {
        const alpha = parseFloat(value.match(/[01]|0?\.\d+/)![0]);
        if (alpha < 0 || alpha > 1) {
          return {
            propertyName: 'color',
            message: 'Alpha value must be between 0 and 1',
            value
          };
        }
      }
    }

    return null;
  }
}

// Dimension validator
export class DimensionValidator implements PropertyValidator {
  private readonly pattern = /^-?\d*\.?\d+(px|em|rem|%|vh|vw|vmin|vmax)$/;

  validate(value: PropertyValue): ValidationError | null {
    if (typeof value !== 'string') {
      return {
        propertyName: 'dimension',
        message: 'Dimension value must be a string',
        value
      };
    }

    if (!this.pattern.test(value)) {
      return {
        propertyName: 'dimension',
        message: 'Invalid dimension format. Must include a unit (px, em, rem, %, vh, vw, vmin, vmax)',
        value
      };
    }

    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      return {
        propertyName: 'dimension',
        message: 'Invalid numeric value in dimension',
        value
      };
    }

    return null;
  }
}

// Expression validator with basic security checks
export class ExpressionValidator implements PropertyValidator {
  private readonly blacklist = [
    'eval',
    'Function',
    'setTimeout',
    'setInterval',
    'fetch',
    'XMLHttpRequest',
    'WebSocket',
    'localStorage',
    'sessionStorage',
    'document',
    'window',
    'process'
  ];

  validate(value: PropertyValue): ValidationError | null {
    if (typeof value !== 'string') {
      return {
        propertyName: 'expression',
        message: 'Expression must be a string',
        value
      };
    }

    // Check for blacklisted terms
    for (const term of this.blacklist) {
      if (value.includes(term)) {
        return {
          propertyName: 'expression',
          message: `Expression contains forbidden term: ${term}`,
          value
        };
      }
    }

    try {
      // Try to parse as valid JavaScript
      new Function(`return (${value})`);
      return null;
    } catch (error) {
      return {
        propertyName: 'expression',
        message: 'Invalid JavaScript expression',
        value,
        constraint: (error as Error).message
      };
    }
  }
}

// Boolean validator
export class BooleanValidator implements PropertyValidator {
  validate(value: PropertyValue): ValidationError | null {
    if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
      return {
        propertyName: 'boolean',
        message: 'Value must be a boolean',
        value
      };
    }
    return null;
  }
}

// Composite validator for multiple validations
export class CompositeValidator implements PropertyValidator {
  constructor(private validators: PropertyValidator[]) {}

  validate(value: PropertyValue): ValidationError | null {
    for (const validator of this.validators) {
      const error = validator.validate(value);
      if (error) {
        return error;
      }
    }
    return null;
  }
}

// Factory function to create appropriate validator
export function createValidator(type: string, constraints: any = {}): PropertyValidator {
  switch (type) {
    case 'string':
      return new StringValidator(
        constraints.minLength,
        constraints.maxLength,
        constraints.pattern ? new RegExp(constraints.pattern) : undefined
      );
    case 'number':
      return new NumberValidator(
        constraints.min,
        constraints.max,
        constraints.step,
        constraints.allowFloat
      );
    case 'color':
      return new ColorValidator();
    case 'dimension':
      return new DimensionValidator();
    case 'expression':
      return new ExpressionValidator();
    case 'select':
      return new StringValidator(); // Use string validator for select
    case 'boolean':
      return new BooleanValidator();
    default:
      throw new Error(`Unknown validator type: ${type}`);
  }
}
