import React, { forwardRef, useState } from "react"
import clsx from "clsx"
import { color, radius, spacing, fontSize, fontWeight, duration, easing } from "../../theme"

export type InputStatus = "default" | "error" | "success"
export type InputSize = "large" | "medium" | "small"

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix" | "size"> {
  label?: string
  inputSize?: InputSize
  status?: InputStatus
  helperText?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  clearable?: boolean
  className?: string
}

const sizeConfig: Record<InputSize, { height: number; padding: string; fontSize: number }> = {
  large: { height: 48, padding: `0 ${spacing[4]}px`, fontSize: fontSize.base },
  medium: { height: 40, padding: `0 ${spacing[3]}px`, fontSize: fontSize.sm },
  small: { height: 32, padding: `0 ${spacing[2]}px`, fontSize: fontSize.xs },
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      inputSize = "medium",
      status = "default",
      helperText,
      prefix,
      suffix,
      clearable = false,
      className,
      style,
      value,
      onChange,
      disabled,
      type = "text",
      ...rest
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false)
    const [internalType, setInternalType] = useState(type)
    const isPassword = type === "password"

    const getBorderColor = () => {
      if (disabled) return color.border.default
      if (status === "error") return color.border.error
      if (status === "success") return color.border.success
      if (focused) return color.border.active
      return color.border.default
    }

    const getBackgroundColor = () => {
      if (disabled) return color.gray[100]
      return color.gray[0]
    }

    const handleClear = () => {
      if (onChange) {
        const event = { target: { value: "" } } as React.ChangeEvent<HTMLInputElement>
        onChange(event)
      }
    }

    const config = sizeConfig[inputSize]

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
        <div
          className="flex items-center transition-all"
          style={{
            height: `${config.height}px`,
            padding: config.padding,
            fontSize: config.fontSize,
            borderRadius: `${radius.md}px`,
            backgroundColor: getBackgroundColor(),
            border: `1px solid ${getBorderColor()}`,
            transition: `all ${duration.normal} ${easing.default}`,
            boxShadow: focused ? `0 0 0 2px ${color.primary[100]}` : "none",
          }}
        >
          {prefix && (
            <span className="inline-flex items-center mr-2" style={{ color: color.text.secondary }}>
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            type={internalType}
            value={value}
            onChange={onChange}
            disabled={disabled}
            aria-invalid={status === "error"}
            aria-describedby={helperText ? `${rest.id || "ui-input"}-helper` : undefined}
            className="flex-1 w-full bg-transparent outline-none text-inherit"
            style={{
              color: disabled ? color.text.disabled : color.text.primary,
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
          {clearable && value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center justify-center ml-2"
              style={{
                width: "16px",
                height: "16px",
                borderRadius: `${radius.full}px`,
                backgroundColor: color.gray[300],
                color: color.gray[0],
                fontSize: "10px",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="清除"
            >
              ×
            </button>
          )}
          {isPassword && (
            <button
              type="button"
              onClick={() => setInternalType(internalType === "password" ? "text" : "password")}
              className="inline-flex items-center justify-center ml-2"
              style={{
                border: "none",
                background: "none",
                color: color.text.secondary,
                cursor: "pointer",
                fontSize: fontSize.xs,
              }}
            >
              {internalType === "password" ? "显示" : "隐藏"}
            </button>
          )}
          {suffix && !isPassword && (
            <span className="inline-flex items-center ml-2" style={{ color: color.text.secondary }}>
              {suffix}
            </span>
          )}
        </div>
        {helperText && (
          <span
            id={`${rest.id || "ui-input"}-helper`}
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

Input.displayName = "Input"
