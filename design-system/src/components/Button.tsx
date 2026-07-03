import React, { useState } from 'react';
import { colors, buttonSizes, buttonRadius, font, spacing } from '../tokens';

type ButtonType = 'primary' | 'secondary' | 'ghost' | 'text' | 'danger';
type ButtonSize = 'mini' | 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonType;
  size?: ButtonSize;
  icon?: React.ReactNode;
  loading?: boolean;
  block?: boolean;
}

const fontWeights = {
  medium: 500,
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  icon,
  loading,
  block,
  disabled,
  children,
  className,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...rest
}) => {
  const [isHover, setIsHover] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const height = buttonSizes[size];
  const borderRadius = buttonRadius[size];

  const getBackgroundColor = () => {
    if (disabled || loading) return colors.gray[300];
    switch (variant) {
      case 'primary':
        return isActive ? colors.primary[700] : isHover ? colors.primary[600] : colors.primary[500];
      case 'secondary':
        return isActive ? colors.gray[200] : isHover ? colors.gray[100] : colors.gray[0];
      case 'ghost':
        return isActive ? colors.primary[100] : isHover ? colors.primary[50] : 'transparent';
      case 'text':
        return 'transparent';
      case 'danger':
        return isActive ? '#B91C1C' : isHover ? '#DC2626' : colors.danger;
      default:
        return colors.primary[500];
    }
  };

  const getColor = () => {
    if (disabled || loading) return colors.gray[0];
    switch (variant) {
      case 'primary':
      case 'danger':
        return colors.gray[0];
      case 'secondary':
        return colors.gray[800];
      case 'ghost':
      case 'text':
        return colors.primary[500];
      default:
        return colors.gray[0];
    }
  };

  const getBorder = () => {
    if (variant === 'secondary') {
      return `1px solid ${colors.gray[200]}`;
    }
    return 'none';
  };

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: `${height}px`,
    borderRadius,
    fontSize: font.body.size,
    fontWeight: fontWeights.medium,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 150ms ease-out',
    border: getBorder(),
    outline: 'none',
    paddingLeft: icon ? spacing.sm : spacing.lg,
    paddingRight: icon ? spacing.sm : spacing.lg,
    gap: icon ? spacing.xs : 0,
    width: block ? '100%' : 'auto',
    backgroundColor: getBackgroundColor(),
    color: getColor(),
    lineHeight: 1,
  };

  return (
    <button
      style={baseStyles}
      disabled={disabled || loading}
      className={className}
      onMouseEnter={(e) => {
        setIsHover(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setIsHover(false);
        setIsActive(false);
        onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        setIsActive(true);
        onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        setIsActive(false);
        onMouseUp?.(e);
      }}
      {...rest}
    >
      {loading ? (
        <span
          style={{
            width: 16,
            height: 16,
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
};
