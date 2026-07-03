import React, { forwardRef } from "react"
import clsx from "clsx"
import { color, radius, fontSize, fontWeight } from "../../theme"

export type AvatarSize = "small" | "medium" | "large" | "xlarge"
export type OnlineStatus = "online" | "offline" | "busy" | "away" | "none"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  text?: string
  size?: AvatarSize
  status?: OnlineStatus
  className?: string
}

const sizeConfig: Record<AvatarSize, { width: number; fontSize: number }> = {
  small: { width: 32, fontSize: fontSize.xs },
  medium: { width: 40, fontSize: fontSize.sm },
  large: { width: 56, fontSize: fontSize.lg },
  xlarge: { width: 80, fontSize: fontSize["2xl"] },
}

const statusColorMap: Record<OnlineStatus, string> = {
  online: color.success[500],
  offline: color.gray[400],
  busy: color.danger[500],
  away: color.warning[500],
  none: "transparent",
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, text, size = "medium", status = "none", className, style, ...rest }, ref) => {
    const config = sizeConfig[size]
    const displayText = text ? text.slice(0, 2) : "?"

    return (
      <div
        ref={ref}
        className={clsx("relative inline-flex items-center justify-center overflow-hidden shrink-0", className)}
        style={{
          width: config.width,
          height: config.width,
          borderRadius: radius.full,
          backgroundColor: color.primary[100],
          color: color.primary[600],
          fontSize: config.fontSize,
          fontWeight: fontWeight.medium,
          ...style,
        }}
        {...rest}
      >
        {src ? (
          <img
            src={src}
            alt={alt || text || "头像"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
        ) : (
          <span>{displayText}</span>
        )}
        {status !== "none" && (
          <span
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: config.width / 4,
              height: config.width / 4,
              borderRadius: radius.full,
              backgroundColor: statusColorMap[status],
              border: `2px solid ${color.bg.white}`,
            }}
          />
        )}
      </div>
    )
  }
)

Avatar.displayName = "Avatar"
