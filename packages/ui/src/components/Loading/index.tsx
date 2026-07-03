import React, { forwardRef } from "react"
import clsx from "clsx"
import { color, radius, fontSize, easing } from "../../theme"

export type LoadingType = "circle" | "dots" | "spinner"
export type LoadingSize = "small" | "medium" | "large"

export interface LoadingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  type?: LoadingType
  size?: LoadingSize
  text?: string
  fullScreen?: boolean
  className?: string
}

const sizeConfig: Record<LoadingSize, { size: number; dot: number }> = {
  small: { size: 20, dot: 4 },
  medium: { size: 32, dot: 6 },
  large: { size: 48, dot: 8 },
}

export const Loading = forwardRef<HTMLDivElement, LoadingProps>(
  ({ type = "circle", size = "medium", text, fullScreen = false, className, style, ...rest }, ref) => {
    const config = sizeConfig[size]

    const renderCircle = () => (
      <div
        style={{
          width: config.size,
          height: config.size,
          borderRadius: radius.full,
          border: `3px solid ${color.gray[200]}`,
          borderTopColor: color.primary[500],
          animation: `ui-loading-spin 1s linear infinite`,
        }}
      />
    )

    const renderDots = () => (
      <div className="flex items-center gap-1" style={{ height: config.size }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: config.dot,
              height: config.dot,
              borderRadius: radius.full,
              backgroundColor: color.primary[500],
              animation: `ui-loading-bounce 1.4s ${easing.default} ${i * 0.16}s infinite both`,
            }}
          />
        ))}
      </div>
    )

    const renderSpinner = () => (
      <svg
        width={config.size}
        height={config.size}
        viewBox="0 0 50 50"
        style={{ animation: `ui-loading-spin 1s linear infinite` }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color.gray[200]}
          strokeWidth="4"
        />
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color.primary[500]}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80"
          strokeDashoffset="60"
        />
      </svg>
    )

    const content = (
      <div
        ref={ref}
        className={clsx("inline-flex flex-col items-center justify-center gap-2", className)}
        style={{
          color: color.text.secondary,
          fontSize: fontSize.sm,
          ...style,
        }}
        {...rest}
      >
        {type === "circle" && renderCircle()}
        {type === "dots" && renderDots()}
        {type === "spinner" && renderSpinner()}
        {text && <span>{text}</span>}
      </div>
    )

    if (fullScreen) {
      return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: color.bg.overlay,
            backdropFilter: "blur(2px)",
          }}
        >
          {content}
        </div>
      )
    }

    return content
  }
)

Loading.displayName = "Loading"
