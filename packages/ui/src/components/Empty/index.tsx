import React, { forwardRef } from "react"
import clsx from "clsx"
import { color, spacing, fontSize, fontWeight } from "../../theme"

export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title?: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export const Empty = forwardRef<HTMLDivElement, EmptyProps>(
  ({ icon, title = "暂无数据", description, children, className, style, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx("flex flex-col items-center justify-center text-center", className)}
        style={{
          padding: `${spacing[8]}px ${spacing[4]}px`,
          ...style,
        }}
        {...rest}
      >
        {icon ? (
          <div style={{ marginBottom: spacing[4], color: color.text.disabled }}>{icon}</div>
        ) : (
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            style={{ marginBottom: spacing[4], color: color.gray[300] }}
          >
            <path
              d="M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="M22 32h20M32 22v20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
        {title && (
          <div
            style={{
              fontSize: fontSize.base,
              fontWeight: fontWeight.medium,
              color: color.text.primary,
              marginBottom: spacing[1],
            }}
          >
            {title}
          </div>
        )}
        {description && (
          <div
            style={{
              fontSize: fontSize.sm,
              color: color.text.secondary,
              marginBottom: spacing[4],
            }}
          >
            {description}
          </div>
        )}
        {children}
      </div>
    )
  }
)

Empty.displayName = "Empty"
