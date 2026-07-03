import React from 'react';
import { X } from 'lucide-react';
import { colors, font, radius, spacing, borderColors, bgColors } from '../tokens';

type InputSize = 'small' | 'medium' | 'large';
type InputStatus = 'default' | 'focus' | 'error' | 'disabled';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
  inputSize?: InputSize;
  status?: InputStatus;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  clearable?: boolean;
  errorMessage?: string;
}

export const Input: React.FC<InputProps> = ({
  inputSize = 'medium',
  status = 'default',
  prefix,
  suffix,
  clearable,
  errorMessage,
  value,
  onChange,
  placeholder,
  disabled,
  className,
  ...rest
}) => {
  const heights = {
    small: 36,
    medium: 44,
    large: 52,
  };

  const handleClear = () => {
    onChange?.({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
  };

  const getBorderColor = () => {
    switch (status) {
      case 'focus':
        return borderColors.focus;
      case 'error':
        return borderColors.error;
      case 'disabled':
        return borderColors.disabled;
      default:
        return borderColors.default;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: `${heights[inputSize]}px`,
          backgroundColor: disabled ? colors.gray[100] : bgColors.input,
          borderRadius: radius.md,
          border: `1px solid ${getBorderColor()}`,
          padding: `0 ${spacing.md}px`,
          transition: 'border-color 150ms ease-out',
        }}
      >
        {prefix && (
          <span style={{ marginRight: spacing.sm, color: colors.gray[400], display: 'inline-flex' }}>
            {prefix}
          </span>
        )}
        <input
          style={{
            flex: 1,
            height: '100%',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontSize: font.body.size,
            color: colors.gray[900],
          }}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={className}
          {...rest}
        />
        {clearable && value && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: spacing.xs,
              color: colors.gray[400],
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        )}
        {suffix && !clearable && (
          <span style={{ marginLeft: spacing.sm, color: colors.gray[400], display: 'inline-flex' }}>
            {suffix}
          </span>
        )}
      </div>
      {errorMessage && (
        <span style={{ fontSize: font.caption.size, color: colors.danger }}>
          {errorMessage}
        </span>
      )}
    </div>
  );
};
