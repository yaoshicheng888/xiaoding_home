import React, { forwardRef, useState } from "react"
import clsx from "clsx"
import { color } from "../../theme"

export type ImageFit = "contain" | "cover" | "fill" | "none" | "scale-down"
export type ImageShape = "square" | "rounded" | "circle"

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt?: string
  width?: number | string
  height?: number | string
  fit?: ImageFit
  shape?: ImageShape
  fallback?: React.ReactNode
  placeholder?: React.ReactNode
  lazy?: boolean
  className?: string
}

const shapeRadiusMap: Record<ImageShape, number> = {
  square: 0,
  rounded: 10,
  circle: 9999,
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt = "",
      width,
      height,
      fit = "cover",
      shape = "rounded",
      fallback,
      placeholder,
      lazy = false,
      className,
      style,
      onLoad,
      onError,
      ...rest
    },
    ref
  ) => {
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(false)

    return (
      <div
        className={clsx("relative overflow-hidden inline-block", className)}
        style={{
          width,
          height,
          borderRadius: shapeRadiusMap[shape],
          backgroundColor: color.gray[100],
          ...style,
        }}
      >
        {!loaded && !error && placeholder}
        {error ? (
          fallback || (
            <div
              className="flex items-center justify-center w-full h-full"
              style={{ color: color.text.disabled, fontSize: 12 }}
            >
              加载失败
            </div>
          )
        ) : (
          <img
            ref={ref}
            src={src}
            alt={alt}
            loading={lazy ? "lazy" : "eager"}
            className={clsx("w-full h-full transition-opacity", loaded ? "opacity-100" : "opacity-0")}
            style={{ objectFit: fit }}
            onLoad={(e) => {
              setLoaded(true)
              onLoad?.(e)
            }}
            onError={(e) => {
              setError(true)
              setLoaded(true)
              onError?.(e)
            }}
            {...rest}
          />
        )}
      </div>
    )
  }
)

Image.displayName = "Image"
