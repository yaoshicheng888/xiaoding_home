export const duration = {
  fast: "100ms",
  normal: "200ms",
  slow: "300ms",
  slower: "500ms",
}

export const easing = {
  default: "ease-out",
  in: "ease-in",
  inOut: "ease-in-out",
  linear: "linear",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
}

export const keyframes = {
  spin: {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
  },
  pulse: {
    "0%, 100%": { opacity: 1 },
    "50%": { opacity: 0.5 },
  },
  bounce: {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-25%)" },
  },
  shimmer: {
    "0%": { backgroundPosition: "-200% 0" },
    "100%": { backgroundPosition: "200% 0" },
  },
}
