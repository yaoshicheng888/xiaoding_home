import React, { forwardRef } from "react"
import clsx from "clsx"
import { color, radius, spacing, fontSize, fontWeight } from "../../theme"

export type TagVariant = "primary" | "success" | "warning" | "danger" | "info" | "default"

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant
  children?: React.ReactNode
  className?: string
}

const variantStyles: Record<TagVariant, { color: string; bg: string }> = {
  primary: { color: color.primary[600], bg: color.primary[50] },
  success: { color: color.success[600], bg: color.success[50] },
  warning: { color: color.warning[600], bg: color.warning[50] },
  danger: { color: color.danger[600], bg: color.danger[50] },
  info: { color: color.info[600], bg: color.info[50] },
  default: { color: color.text.secondary, bg: color.gray[100] },
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ variant = "default", children, className, style, ...rest }, ref) => {
    const styles = variantStyles[variant]

    return (
      <span
        ref={ref}
        className={clsx("inline-flex items-center", className)}
        style={{
          padding: `${spacing[0.5]}px ${spacing[2]}px`,
          fontSize: fontSize.xs,
          fontWeight: fontWeight.medium,
          borderRadius: `${radius.sm}px`,
          backgroundColor: styles.bg,
          color: styles.color,
          ...style,
        }}
        {...rest}
      >
        {children}
      </span>
    )
  }
)

Tag.displayName = "Tag"
