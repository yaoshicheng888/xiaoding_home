import React, { forwardRef } from "react"
import clsx from "clsx"
import { color, radius, easing } from "../../theme"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "rounded"
  width?: number | string
  height?: number | string
  animated?: boolean
  className?: string
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = "text", width, height, animated = true, className, style, ...rest }, ref) => {
    const getBorderRadius = () => {
      switch (variant) {
        case "circular":
          return radius.full
        case "rounded":
          return radius.md
        case "rectangular":
          return radius.none
        case "text":
        default:
          return radius.sm
      }
    }

    return (
      <div
        ref={ref}
        className={clsx("bg-gray-200", animated && "animate-pulse", className)}
        style={{
          width: width ?? (variant === "text" ? "100%" : undefined),
          height: height ?? (variant === "text" ? 16 : undefined),
          borderRadius: getBorderRadius(),
          backgroundColor: color.gray[200],
          backgroundImage: animated
            ? `linear-gradient(90deg, ${color.gray[200]} 25%, ${color.gray[100]} 50%, ${color.gray[200]} 75%)`
            : undefined,
          backgroundSize: "200% 100%",
          animation: animated ? `ui-skeleton-shimmer 1.5s ${easing.default} infinite` : undefined,
          ...style,
        }}
        {...rest}
      />
    )
  }
)

Skeleton.displayName = "Skeleton"
