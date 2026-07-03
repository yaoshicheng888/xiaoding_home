import React from "react"
import clsx from "clsx"

type ButtonProps = {
  children: React.ReactNode
  type?: "primary" | "default" | "danger"
  onClick?: () => void
  className?: string
}

export const Button = ({
  children,
  type = "default",
  onClick,
  className,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-4 py-2 rounded-lg font-medium transition",
        type === "primary" && "bg-blue-500 text-white",
        type === "default" && "bg-gray-100 text-black",
        type === "danger" && "bg-red-500 text-white",
        className
      )}
    >
      {children}
    </button>
  )
}
