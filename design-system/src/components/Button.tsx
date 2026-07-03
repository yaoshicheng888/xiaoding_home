import React from 'react';
import { colors, buttonSizes, buttonRadius, font, shadows, spacing } from '../tokens';

type ButtonType = 'primary' | 'secondary' | 'ghost' | 'text' | 'danger';
type ButtonSize = 'mini' | 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: ButtonType;
  size?: ButtonSize;
  icon?: React.ReactNode;
  loading?: boolean;
  block?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  type = 'primary',
  size = 'medium',
  icon,
  loading,
  block,
  disabled,
  children,
  className,
  ...rest
}) => {
  const height = buttonSizes[size];
  const borderRadius = buttonRadius[size];

  const getStyles = () => {
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
      border: 'none',
      outline: 'none',
      paddingLeft: icon ? spacing.sm : spacing.lg,
      paddingRight: icon ? spacing.sm : spacing.lg,
      gap: icon ? spacing.xs : 0,
      width: block ? '100%' : 'auto',
    };

    switch (type) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: disabled ? colors.gray[300] : colors.primary[500],
          color: colors.gray[0],
          '&:hover': disabled ? {} : { backgroundColor: colors.primary[600] },
          '&:active': disabled ? {} : { backgroundColor: colors.primary[700] },
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: colors.gray[0],
          color: colors.gray[800],
          border: `1px solid ${colors.gray[200]}`,
          '&:hover': disabled ? {} : { backgroundColor: colors.gray[100] },
        };
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: colors.primary[500],
          '&:hover': disabled ? {} : { backgroundColor: colors.primary[50] },
        };
      case 'text':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: colors.primary[500],
          padding: 0,
        };
      case 'danger':
        return {
          ...baseStyles,
          backgroundColor: disabled ? colors.gray[300] : colors.danger,
          color: colors.gray[0],
          '&:hover': disabled ? {} : { backgroundColor: '#DC2626' },
        };
      default:
        return baseStyles;
    }
  };

  const fontWeights = {
    medium: 500,
  };

  return (
    <button
      style={getStyles()}
      disabled={disabled || loading}
      className={className}
      {...rest}
    >
      {loading ? (
        <span style={{ width: 16, height: 16, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
};