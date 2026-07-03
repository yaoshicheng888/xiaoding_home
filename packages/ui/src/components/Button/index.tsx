import React, { forwardRef } from "react"
import clsx from "clsx"
import { color, radius, spacing, fontSize, fontWeight, shadow, duration, easing } from "../../theme"

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "text"
export type ButtonSize = "large" | "medium" | "small"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: React.ReactNode
  loading?: boolean
  block?: boolean
  fullWidth?: boolean
  children?: React.ReactNode
  className?: string
}

const sizeConfig: Record<ButtonSize, { height: number; padding: string; fontSize: number }> = {
  large: { height: 48, padding: `${spacing[3]}px ${spacing[6]}px`, fontSize: fontSize.base },
  medium: { height: 40, padding: `${spacing[2]}px ${spacing[4]}px`, fontSize: fontSize.sm },
  small: { height: 32, padding: `${spacing[1.5]}px ${spacing[3]}px`, fontSize: fontSize.xs },
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "medium",
      icon,
      loading = false,
      block = false,
      fullWidth = false,
      children,
      className,
      disabled,
      style,
      onClick,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading
    const config = sizeConfig[size]

    const getBackgroundColor = () => {
      if (isDisabled) return color.gray[200]
      switch (variant) {
        case "primary":
          return color.primary[500]
        case "secondary":
          return color.gray[100]
        case "ghost":
          return "transparent"
        case "danger":
          return color.danger[500]
        case "text":
          return "transparent"
        default:
          return color.primary[500]
      }
    }

    const getColor = () => {
      if (isDisabled) return color.text.disabled
      switch (variant) {
        case "primary":
        case "danger":
          return color.gray[0]
        case "secondary":
          return color.text.primary
        case "ghost":
        case "text":
          return color.primary[500]
        default:
          return color.gray[0]
      }
    }

    const getBorder = () => {
      if (isDisabled) return `1px solid ${color.border.default}`
      if (variant === "secondary") return `1px solid ${color.border.default}`
      if (variant === "ghost") return `1px solid ${color.primary[500]}`
      return "none"
    }

    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center gap-1 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2",
          className
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        onClick={onClick}
        style={{
          height: `${config.height}px`,
          padding: config.padding,
          fontSize: config.fontSize,
          fontWeight: fontWeight.medium,
          borderRadius: `${radius.md}px`,
          backgroundColor: getBackgroundColor(),
          color: getColor(),
          border: getBorder(),
          boxShadow: variant === "primary" && !isDisabled ? shadow.sm : shadow.none,
          width: block || fullWidth ? "100%" : "auto",
          cursor: isDisabled ? "not-allowed" : "pointer",
          opacity: isDisabled ? 0.6 : 1,
          transition: `all ${duration.normal} ${easing.default}`,
          ...style,
        }}
        {...rest}
      >
        {loading ? (
          <span
            className="inline-block"
            style={{
              width: "16px",
              height: "16px",
              border: `2px solid currentColor`,
              borderTopColor: "transparent",
              borderRadius: `${radius.full}px`,
              animation: `ui-button-spin 1s linear infinite`,
            }}
          />
        ) : (
          icon
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
