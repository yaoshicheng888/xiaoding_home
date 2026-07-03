import React, { forwardRef } from "react"
import clsx from "clsx"
import { color, radius, fontSize, fontWeight } from "../../theme"

export type BadgeStatus = "primary" | "success" | "warning" | "danger" | "info" | "default"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  count?: number
  maxCount?: number
  dot?: boolean
  status?: BadgeStatus
  children?: React.ReactNode
  className?: string
}

const statusColorMap: Record<BadgeStatus, string> = {
  primary: color.primary[500],
  success: color.success[500],
  warning: color.warning[500],
  danger: color.danger[500],
  info: color.info[500],
  default: color.gray[500],
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ count, maxCount = 99, dot = false, status = "danger", children, className, style, ...rest }, ref) => {
    const bgColor = statusColorMap[status]

    if (dot) {
      return (
        <span
          ref={ref}
          className={clsx("relative inline-flex", className)}
          style={style}
          {...rest}
        >
          {children}
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              width: "8px",
              height: "8px",
              borderRadius: radius.full,
              backgroundColor: bgColor,
            }}
          />
        </span>
      )
    }

    if (count !== undefined) {
      const displayCount = count > maxCount ? `${maxCount}+` : count
      return (
        <span
          ref={ref}
          className={clsx("inline-flex items-center justify-center text-white", className)}
          style={{
            minWidth: "18px",
            height: "18px",
            padding: "0 5px",
            fontSize: fontSize.xs,
            fontWeight: fontWeight.medium,
            borderRadius: radius.full,
            backgroundColor: bgColor,
            ...style,
          }}
          {...rest}
        >
          {displayCount}
        </span>
      )
    }

    return (
      <span
        ref={ref}
        className={clsx("inline-flex items-center justify-center px-2 py-0.5 text-white", className)}
        style={{
          fontSize: fontSize.xs,
          fontWeight: fontWeight.medium,
          borderRadius: `${radius.sm}px`,
          backgroundColor: bgColor,
          ...style,
        }}
        {...rest}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = "Badge"
