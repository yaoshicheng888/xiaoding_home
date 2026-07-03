import React, { useState } from 'react';
import { colors, font, radius, spacing, borderColors, bgColors } from '../tokens';

type TextareaSize = 'small' | 'medium' | 'large';
type TextareaStatus = 'default' | 'focus' | 'error' | 'disabled';

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'prefix' | 'suffix'> {
  inputSize?: TextareaSize;
  status?: TextareaStatus;
  errorMessage?: string;
  autoResize?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  inputSize = 'medium',
  status = 'default',
  errorMessage,
  autoResize = false,
  value,
  onChange,
  placeholder,
  disabled,
  className,
  style,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const paddings: Record<TextareaSize, string> = {
    small: `${spacing.sm}px ${spacing.md}px`,
    medium: `${spacing.md}px ${spacing.md}px`,
    large: `${spacing.lg}px ${spacing.md}px`,
  };

  const fontSizes: Record<TextareaSize, number> = {
    small: font.caption.size,
    medium: font.body.size,
    large: font.body.size,
  };

  const getBorderColor = () => {
    if (status === 'error') return borderColors.error;
    if (disabled) return borderColors.disabled;
    if (isFocused || status === 'focus') return borderColors.focus;
    return borderColors.default;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs }}>
      <textarea
        style={{
          width: '100%',
          padding: paddings[inputSize],
          fontSize: fontSizes[inputSize],
          color: disabled ? colors.gray[400] : colors.gray[900],
          backgroundColor: disabled ? colors.gray[100] : bgColors.input,
          borderRadius: radius.md,
          border: `1px solid ${getBorderColor()}`,
          outline: 'none',
          resize: autoResize ? 'none' : 'vertical',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
          lineHeight: 1.5,
          transition: 'border-color 150ms ease-out',
          cursor: disabled ? 'not-allowed' : 'text',
          ...style,
        }}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={className}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {errorMessage && (
        <span style={{ fontSize: font.caption.size, color: colors.danger }}>
          {errorMessage}
        </span>
      )}
    </div>
  );
};
