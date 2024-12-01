import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyField } from '../page';
import { toast } from '@/components/ui/use-toast';

jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn()
}));

describe('PropertyField', () => {
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('String Properties', () => {
    it('renders string input', () => {
      render(
        <PropertyField
          elementId="test"
          propertyName="text"
          propertyConfig={{
            type: 'string',
            default: 'Default'
          }}
          currentValue="Test"
          onUpdate={mockOnUpdate}
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('Test');
    });

    it('validates string input', () => {
      render(
        <PropertyField
          elementId="test"
          propertyName="text"
          propertyConfig={{
            type: 'string',
            minLength: 3
          }}
          currentValue=""
          onUpdate={mockOnUpdate}
        />
      );

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'ab' } });

      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        variant: 'destructive'
      }));
      expect(mockOnUpdate).not.toHaveBeenCalled();
    });
  });

  describe('Number Properties', () => {
    it('renders number input with slider', () => {
      render(
        <PropertyField
          elementId="test"
          propertyName="size"
          propertyConfig={{
            type: 'number',
            default: 50,
            min: 0,
            max: 100
          }}
          currentValue={50}
          onUpdate={mockOnUpdate}
        />
      );

      const input = screen.getByRole('spinbutton');
      const slider = screen.getByRole('slider');
      
      expect(input).toHaveValue(50);
      expect(slider).toHaveValue('50');
    });

    it('validates number input', () => {
      render(
        <PropertyField
          elementId="test"
          propertyName="size"
          propertyConfig={{
            type: 'number',
            min: 0,
            max: 100
          }}
          currentValue={50}
          onUpdate={mockOnUpdate}
        />
      );

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '-1' } });

      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        variant: 'destructive'
      }));
      expect(mockOnUpdate).not.toHaveBeenCalled();
    });
  });

  describe('Select Properties', () => {
    it('renders select input', () => {
      render(
        <PropertyField
          elementId="test"
          propertyName="variant"
          propertyConfig={{
            type: 'select',
            options: ['default', 'primary', 'secondary'],
            default: 'default'
          }}
          currentValue="default"
          onUpdate={mockOnUpdate}
        />
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('default');
    });

    it('validates select input', () => {
      render(
        <PropertyField
          elementId="test"
          propertyName="variant"
          propertyConfig={{
            type: 'select',
            options: ['default', 'primary', 'secondary']
          }}
          currentValue="default"
          onUpdate={mockOnUpdate}
        />
      );

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'invalid' } });

      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        variant: 'destructive'
      }));
      expect(mockOnUpdate).not.toHaveBeenCalled();
    });
  });

  describe('Color Properties', () => {
    it('renders color input', () => {
      render(
        <PropertyField
          elementId="test"
          propertyName="color"
          propertyConfig={{
            type: 'color',
            default: '#000000'
          }}
          currentValue="#ff0000"
          onUpdate={mockOnUpdate}
        />
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('#ff0000');
    });

    it('validates color input', () => {
      render(
        <PropertyField
          elementId="test"
          propertyName="color"
          propertyConfig={{
            type: 'color'
          }}
          currentValue="#ff0000"
          onUpdate={mockOnUpdate}
        />
      );

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'invalid' } });

      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        variant: 'destructive'
      }));
      expect(mockOnUpdate).not.toHaveBeenCalled();
    });
  });

  describe('Boolean Properties', () => {
    it('renders switch input', () => {
      render(
        <PropertyField
          elementId="test"
          propertyName="enabled"
          propertyConfig={{
            type: 'boolean',
            default: false
          }}
          currentValue={true}
          onUpdate={mockOnUpdate}
        />
      );

      const switchInput = screen.getByRole('switch');
      expect(switchInput).toBeChecked();
    });

    it('updates boolean value', () => {
      render(
        <PropertyField
          elementId="test"
          propertyName="enabled"
          propertyConfig={{
            type: 'boolean'
          }}
          currentValue={false}
          onUpdate={mockOnUpdate}
        />
      );

      const switchInput = screen.getByRole('switch');
      fireEvent.click(switchInput);

      expect(mockOnUpdate).toHaveBeenCalledWith(true);
    });
  });

  it('displays validation errors', () => {
    render(
      <PropertyField
        elementId="test"
        propertyName="text"
        propertyConfig={{
          type: 'string',
          minLength: 3
        }}
        currentValue=""
        onUpdate={mockOnUpdate}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'ab' } });

    const error = screen.getByText(/must be at least 3 characters/i);
    expect(error).toBeInTheDocument();
  });

  it('shows property name and unit', () => {
    render(
      <PropertyField
        elementId="test"
        propertyName="fontSize"
        propertyConfig={{
          type: 'number',
          unit: 'px'
        }}
        currentValue={16}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Font Size')).toBeInTheDocument();
    expect(screen.getByText('px')).toBeInTheDocument();
  });
});
