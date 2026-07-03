import React, { forwardRef } from "react"
import clsx from "clsx"
import { color, spacing } from "../../theme"

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical"
  dashed?: boolean
  text?: React.ReactNode
  className?: string
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ direction = "horizontal", dashed = false, text, className, style, ...rest }, ref) => {
    const borderStyle = dashed ? "dashed" : "solid"

    if (direction === "vertical") {
      return (
        <div
          ref={ref}
          className={clsx("inline-block align-middle", className)}
          style={{
            width: "1px",
            height: "1em",
            margin: `0 ${spacing[2]}px`,
            borderLeft: `1px ${borderStyle} ${color.border.default}`,
            ...style,
          }}
          {...rest}
        />
      )
    }

    return (
      <div
        ref={ref}
        className={clsx("flex items-center w-full", className)}
        style={{
          margin: `${spacing[3]}px 0`,
          ...style,
        }}
        {...rest}
      >
        <div
          style={{
            flex: 1,
            borderTop: `1px ${borderStyle} ${color.border.default}`,
          }}
        />
        {text && (
          <span
            style={{
              padding: `0 ${spacing[3]}px`,
              color: color.text.secondary,
              fontSize: "inherit",
            }}
          >
            {text}
          </span>
        )}
        <div
          style={{
            flex: 1,
            borderTop: `1px ${borderStyle} ${color.border.default}`,
          }}
        />
      </div>
    )
  }
)

Divider.displayName = "Divider"
