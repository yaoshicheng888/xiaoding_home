import React, { forwardRef, useState } from "react"
import clsx from "clsx"
import { color, radius, spacing, fontSize, fontWeight, duration, easing } from "../../theme"

export type TextareaStatus = "default" | "error" | "success"
export type TextareaSize = "large" | "medium" | "small"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  textareaSize?: TextareaSize
  status?: TextareaStatus
  helperText?: string
  className?: string
}

const sizeConfig: Record<TextareaSize, { padding: string; fontSize: number; minHeight: number }> = {
  large: { padding: `${spacing[3]}px ${spacing[4]}px`, fontSize: fontSize.base, minHeight: 120 },
  medium: { padding: `${spacing[2]}px ${spacing[3]}px`, fontSize: fontSize.sm, minHeight: 80 },
  small: { padding: `${spacing[1.5]}px ${spacing[2]}px`, fontSize: fontSize.xs, minHeight: 56 },
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      textareaSize = "medium",
      status = "default",
      helperText,
      className,
      style,
      disabled,
      ...rest
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false)

    const getBorderColor = () => {
      if (disabled) return color.border.default
      if (status === "error") return color.border.error
      if (status === "success") return color.border.success
      if (focused) return color.border.active
      return color.border.default
    }

    const config = sizeConfig[textareaSize]

    return (
      <div className={clsx("flex flex-col gap-1", className)} style={style}>
        {label && (
          <label
            style={{
              fontSize: fontSize.sm,
              fontWeight: fontWeight.medium,
              color: disabled ? color.text.disabled : color.text.primary,
            }}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          disabled={disabled}
          aria-invalid={status === "error"}
          aria-describedby={helperText ? `${rest.id || "ui-textarea"}-helper` : undefined}
          className="w-full bg-transparent outline-none resize-y"
          style={{
            minHeight: config.minHeight,
            padding: config.padding,
            fontSize: config.fontSize,
            borderRadius: `${radius.md}px`,
            backgroundColor: disabled ? color.gray[100] : color.gray[0],
            color: disabled ? color.text.disabled : color.text.primary,
            border: `1px solid ${getBorderColor()}`,
            transition: `all ${duration.normal} ${easing.default}`,
            boxShadow: focused ? `0 0 0 2px ${color.primary[100]}` : "none",
            fontFamily: "inherit",
            lineHeight: 1.5,
          }}
          onFocus={(e) => {
            setFocused(true)
            rest.onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            rest.onBlur?.(e)
          }}
          {...rest}
        />
        {helperText && (
          <span
            id={`${rest.id || "ui-textarea"}-helper`}
            style={{
              fontSize: fontSize.xs,
              color: status === "error" ? color.danger[500] : status === "success" ? color.success[500] : color.text.secondary,
            }}
          >
            {helperText}
          </span>
        )}
      </div>
    )
  }
)

Textarea.displayName = "Textarea"
