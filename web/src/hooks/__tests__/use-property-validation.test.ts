import { renderHook, act } from '@testing-library/react';
import { usePropertyValidation } from '../use-property-validation';

describe('usePropertyValidation', () => {
  it('initializes with valid state', () => {
    const { result } = renderHook(() => usePropertyValidation({
      type: 'string',
      initialValue: 'test'
    }));

    expect(result.current.isValid).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.value).toBe('test');
  });

  it('validates string values', () => {
    const { result } = renderHook(() => usePropertyValidation({
      type: 'string',
      initialValue: '',
      constraints: {
        minLength: 3
      }
    }));

    act(() => {
      result.current.validate('ab');
    });

    expect(result.current.isValid).toBe(false);
    expect(result.current.error).toBeTruthy();

    act(() => {
      result.current.validate('abc');
    });

    expect(result.current.isValid).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('validates number values', () => {
    const { result } = renderHook(() => usePropertyValidation({
      type: 'number',
      initialValue: 0,
      constraints: {
        min: 0,
        max: 100
      }
    }));

    act(() => {
      result.current.validate(-1);
    });

    expect(result.current.isValid).toBe(false);
    expect(result.current.error).toBeTruthy();

    act(() => {
      result.current.validate(50);
    });

    expect(result.current.isValid).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('validates color values', () => {
    const { result } = renderHook(() => usePropertyValidation({
      type: 'color',
      initialValue: '#000000'
    }));

    act(() => {
      result.current.validate('invalid');
    });

    expect(result.current.isValid).toBe(false);
    expect(result.current.error).toBeTruthy();

    act(() => {
      result.current.validate('#ff0000');
    });

    expect(result.current.isValid).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('validates dimension values', () => {
    const { result } = renderHook(() => usePropertyValidation({
      type: 'dimension',
      initialValue: '100px'
    }));

    act(() => {
      result.current.validate('invalid');
    });

    expect(result.current.isValid).toBe(false);
    expect(result.current.error).toBeTruthy();

    act(() => {
      result.current.validate('50%');
    });

    expect(result.current.isValid).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('calls onChange when value is valid', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => usePropertyValidation({
      type: 'string',
      initialValue: '',
      onChange
    }));

    act(() => {
      result.current.validate('valid');
    });

    expect(onChange).toHaveBeenCalledWith('valid');
  });

  it('does not call onChange when value is invalid', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => usePropertyValidation({
      type: 'number',
      initialValue: 0,
      constraints: {
        min: 0
      },
      onChange
    }));

    act(() => {
      result.current.validate(-1);
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('resets to initial state', () => {
    const { result } = renderHook(() => usePropertyValidation({
      type: 'string',
      initialValue: 'initial'
    }));

    act(() => {
      result.current.validate('changed');
    });

    expect(result.current.value).toBe('changed');

    act(() => {
      result.current.reset();
    });

    expect(result.current.value).toBe('initial');
    expect(result.current.isValid).toBe(true);
    expect(result.current.error).toBeNull();
  });
});
