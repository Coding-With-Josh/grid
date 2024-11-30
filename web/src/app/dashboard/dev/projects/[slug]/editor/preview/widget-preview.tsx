import React from 'react';
import { cn } from '@/lib/utils';

interface WidgetPreviewProps {
  type: string;
  properties: Record<string, any>;
  className?: string;
}

export const WidgetPreview: React.FC<WidgetPreviewProps> = ({ type, properties, className }) => {
  const renderTextElement = () => {
    const style = {
      fontSize: `${properties.fontSize}px`,
      fontWeight: properties.fontWeight,
      fontFamily: properties.fontFamily,
      letterSpacing: `${properties.letterSpacing}px`,
      lineHeight: properties.lineHeight,
      color: properties.color,
      textAlign: properties.alignment,
      textTransform: properties.transform,
      opacity: properties.opacity ? properties.opacity / 100 : 1,
      marginBottom: properties.marginBottom ? `${properties.marginBottom}px` : undefined,
    };

    return (
      <div 
        style={style}
        className={cn(
          'transition-all duration-200',
          properties.animation === 'fade' && 'animate-fade-in',
          properties.animation === 'slide' && 'animate-slide-in',
          properties.animation === 'bounce' && 'animate-bounce',
          className
        )}
      >
        {properties.text}
      </div>
    );
  };

  const renderLink = () => {
    const style = {
      color: properties.color,
      fontSize: `${properties.fontSize}px`,
      fontWeight: properties.fontWeight,
      textDecoration: properties.underline ? 'underline' : 'none',
    };

    return (
      <a
        href={properties.url}
        target={properties.target}
        rel={properties.rel !== 'none' ? properties.rel : undefined}
        style={style}
        className={cn(
          'transition-colors duration-200 hover:opacity-80',
          className
        )}
        aria-label={properties.ariaLabel}
      >
        {properties.text}
      </a>
    );
  };

  const renderButton = () => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md transition-all duration-200';
    const variantStyles = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    };

    const sizeStyles = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 px-3',
      lg: 'h-11 px-8',
      icon: 'h-10 w-10',
    };

    return (
      <button
        type="button"
        disabled={properties.disabled || properties.loading}
        className={cn(
          baseStyles,
          variantStyles[properties.variant as keyof typeof variantStyles],
          sizeStyles[properties.size as keyof typeof sizeStyles],
          properties.width === 'full' && 'w-full',
          properties.disabled && 'opacity-50 cursor-not-allowed',
          properties.animation === 'pulse' && 'animate-pulse',
          properties.animation === 'bounce' && 'animate-bounce',
          properties.animation === 'spin' && 'animate-spin',
          className
        )}
        title={properties.tooltip}
        aria-label={properties.ariaLabel}
      >
        {properties.loading ? (
          <span className="inline-block animate-spin mr-2">⟳</span>
        ) : properties.icon === 'start' && (
          <span className="mr-2">{properties.iconType}</span>
        )}
        {properties.text}
        {!properties.loading && properties.icon === 'end' && (
          <span className="ml-2">{properties.iconType}</span>
        )}
      </button>
    );
  };

  const renderInput = () => {
    const baseStyles = 'flex rounded-md border border-input bg-transparent transition-colors';
    const sizeStyles = {
      default: 'h-10 px-3 py-2',
      sm: 'h-8 px-2 py-1 text-sm',
      lg: 'h-12 px-4 py-3',
    };

    const variantStyles = {
      default: 'border border-input',
      filled: 'border-none bg-secondary',
      outline: 'border-2',
      underline: 'border-t-0 border-l-0 border-r-0 rounded-none',
    };

    const input = (
      <input
        type={properties.type}
        placeholder={properties.placeholder}
        required={properties.required}
        disabled={properties.disabled}
        readOnly={properties.readOnly}
        autoComplete={properties.autoComplete ? 'on' : 'off'}
        pattern={properties.pattern}
        minLength={properties.minLength}
        maxLength={properties.maxLength}
        min={properties.min}
        max={properties.max}
        step={properties.step}
        spellCheck={properties.spellCheck}
        autoCapitalize={properties.autoCapitalize}
        className={cn(
          'w-full bg-transparent outline-none',
          properties.disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      />
    );

    return (
      <div className="space-y-2">
        {properties.labelText && (
          <label className="text-sm font-medium leading-none">
            {properties.labelText}
          </label>
        )}
        <div
          className={cn(
            baseStyles,
            sizeStyles[properties.size as keyof typeof sizeStyles],
            variantStyles[properties.variant as keyof typeof variantStyles],
            properties.fullWidth && 'w-full',
            properties.disabled && 'opacity-50'
          )}
        >
          {properties.prefix && (
            <span className="text-muted-foreground mr-2">{properties.prefix}</span>
          )}
          {properties.icon !== 'none' && properties.iconPosition === 'left' && (
            <span className="text-muted-foreground mr-2">{properties.icon}</span>
          )}
          {input}
          {properties.icon !== 'none' && properties.iconPosition === 'right' && (
            <span className="text-muted-foreground ml-2">{properties.icon}</span>
          )}
          {properties.suffix && (
            <span className="text-muted-foreground ml-2">{properties.suffix}</span>
          )}
          {properties.clearable && (
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground ml-2"
              onClick={() => {/* Add clear functionality */}}
            >
              ×
            </button>
          )}
        </div>
        {properties.helperText && (
          <p className="text-sm text-muted-foreground">{properties.helperText}</p>
        )}
        {properties.errorText && (
          <p className="text-sm text-destructive">{properties.errorText}</p>
        )}
      </div>
    );
  };

  const renderPreview = () => {
    switch (type) {
      case 'text':
      case 'heading1':
      case 'heading2':
      case 'paragraph':
        return renderTextElement();
      case 'link':
        return renderLink();
      case 'button':
        return renderButton();
      case 'input':
        return renderInput();
      default:
        return <div>Unsupported widget type: {type}</div>;
    }
  };

  return renderPreview();
};
