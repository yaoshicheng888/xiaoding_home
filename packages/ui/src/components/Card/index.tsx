import React, { forwardRef } from "react"
import clsx from "clsx"
import { color, radius, shadow, spacing, duration, easing } from "../../theme"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode
  footer?: React.ReactNode
  shadowLevel?: "none" | "sm" | "md" | "lg" | "xl"
  bordered?: boolean
  hoverable?: boolean
  clickable?: boolean
  children?: React.ReactNode
  className?: string
}

const shadowMap = {
  none: shadow.none,
  sm: shadow.sm,
  md: shadow.md,
  lg: shadow.lg,
  xl: shadow.xl,
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      header,
      footer,
      shadowLevel = "none",
      bordered = false,
      hoverable = false,
      clickable = false,
      children,
      className,
      style,
      onClick,
      ...rest
    },
    ref
  ) => {
    const isClickable = clickable || onClick !== undefined

    return (
      <div
        ref={ref}
        className={clsx(
          "overflow-hidden bg-white transition-all",
          isClickable && "cursor-pointer",
          hoverable && "hover:-translate-y-1",
          className
        )}
        onClick={onClick}
        style={{
          borderRadius: `${radius.lg}px`,
          backgroundColor: color.bg.white,
          boxShadow: shadowMap[shadowLevel],
          border: bordered ? `1px solid ${color.border.default}` : "none",
          transition: `all ${duration.normal} ${easing.default}`,
          ...style,
        }}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        {...rest}
      >
        {header && (
          <div
            style={{
              padding: `${spacing[4]}px ${spacing[5]}px`,
              borderBottom: `1px solid ${color.border.default}`,
            }}
          >
            {header}
          </div>
        )}
        <div style={{ padding: `${spacing[5]}px` }}>{children}</div>
        {footer && (
          <div
            style={{
              padding: `${spacing[4]}px ${spacing[5]}px`,
              borderTop: `1px solid ${color.border.default}`,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    )
  }
)

Card.displayName = "Card"
