import { useState, useCallback } from 'react';
import { PropertyValue } from '@/lib/editor/property-system';
import { ValidationError, createValidator } from '@/lib/editor/property-validators';

interface ValidationState {
  isValid: boolean;
  error: ValidationError | null;
  value: PropertyValue;
}

interface UsePropertyValidationProps {
  type: string;
  initialValue: PropertyValue;
  constraints?: any;
  onChange?: (value: PropertyValue) => void;
}

export function usePropertyValidation({
  type,
  initialValue,
  constraints,
  onChange
}: UsePropertyValidationProps) {
  const [state, setState] = useState<ValidationState>({
    isValid: true,
    error: null,
    value: initialValue
  });

  const validator = createValidator(type, constraints);

  const validate = useCallback((value: PropertyValue): boolean => {
    const error = validator.validate(value);
    const isValid = !error;

    setState({
      isValid,
      error,
      value
    });

    if (isValid && onChange) {
      onChange(value);
    }

    return isValid;
  }, [validator, onChange]);

  const reset = useCallback(() => {
    setState({
      isValid: true,
      error: null,
      value: initialValue
    });
  }, [initialValue]);

  return {
    isValid: state.isValid,
    error: state.error,
    value: state.value,
    validate,
    reset
  };
}
