import { jsxs as $, jsx as n } from "react/jsx-runtime";
import { forwardRef as w, useState as j } from "react";
function T(r) {
  var i, o, t = "";
  if (typeof r == "string" || typeof r == "number") t += r;
  else if (typeof r == "object") if (Array.isArray(r)) {
    var a = r.length;
    for (i = 0; i < a; i++) r[i] && (o = T(r[i])) && (t && (t += " "), t += o);
  } else for (o in r) r[o] && (t && (t += " "), t += o);
  return t;
}
function h() {
  for (var r, i, o = 0, t = "", a = arguments.length; o < a; o++) (r = arguments[o]) && (i = T(r)) && (t && (t += " "), t += i);
  return t;
}
const e = {
  primary: {
    50: "#e6f4ff",
    100: "#bfe3ff",
    200: "#99d1ff",
    300: "#66b5ff",
    400: "#3399ff",
    500: "#1677ff",
    600: "#0958d9",
    700: "#0745ad",
    800: "#053382",
    900: "#032256"
  },
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d"
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f"
  },
  danger: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d"
  },
  info: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a"
  },
  gray: {
    0: "#ffffff",
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    1e3: "#030712"
  },
  text: {
    primary: "#111827",
    secondary: "#6b7280",
    disabled: "#9ca3af",
    inverse: "#ffffff",
    link: "#1677ff"
  },
  bg: {
    white: "#ffffff",
    gray: "#f3f4f6",
    dark: "#111827",
    overlay: "rgba(0, 0, 0, 0.45)"
  },
  border: {
    default: "#e5e7eb",
    hover: "#d1d5db",
    active: "#1677ff",
    error: "#ef4444",
    success: "#22c55e"
  }
}, de = {
  text: {
    primary: "#f9fafb",
    secondary: "#d1d5db",
    disabled: "#6b7280",
    inverse: "#111827",
    link: "#60a5fa"
  },
  bg: {
    white: "#111827",
    gray: "#1f2937",
    dark: "#030712",
    overlay: "rgba(0, 0, 0, 0.75)"
  },
  border: {
    default: "#374151",
    hover: "#4b5563",
    active: "#60a5fa",
    error: "#f87171",
    success: "#4ade80"
  }
}, l = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384
}, b = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999
}, N = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)"
}, p = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
  "6xl": 60
}, S = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700
}, ce = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2
}, fe = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0em",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em"
}, ue = {
  sans: '-apple-system, BlinkMacSystemFont, "PingFang SC", "HarmonyOS Sans SC", "Noto Sans SC", "Microsoft YaHei", sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
}, F = {
  fast: "100ms",
  normal: "200ms",
  slow: "300ms",
  slower: "500ms"
}, R = {
  default: "ease-out",
  in: "ease-in",
  inOut: "ease-in-out",
  linear: "linear",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
}, pe = {
  spin: {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" }
  },
  pulse: {
    "0%, 100%": { opacity: 1 },
    "50%": { opacity: 0.5 }
  },
  bounce: {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-25%)" }
  },
  shimmer: {
    "0%": { backgroundPosition: "-200% 0" },
    "100%": { backgroundPosition: "200% 0" }
  }
}, E = {
  large: { height: 48, padding: `${l[3]}px ${l[6]}px`, fontSize: p.base },
  medium: { height: 40, padding: `${l[2]}px ${l[4]}px`, fontSize: p.sm },
  small: { height: 32, padding: `${l[1.5]}px ${l[3]}px`, fontSize: p.xs }
}, A = w(
  ({
    variant: r = "primary",
    size: i = "medium",
    icon: o,
    loading: t = !1,
    block: a = !1,
    fullWidth: c = !1,
    children: s,
    className: d,
    disabled: f,
    style: u,
    onClick: m,
    ...x
  }, y) => {
    const g = f || t, z = E[i], k = () => {
      if (g) return e.gray[200];
      switch (r) {
        case "primary":
          return e.primary[500];
        case "secondary":
          return e.gray[100];
        case "ghost":
          return "transparent";
        case "danger":
          return e.danger[500];
        case "text":
          return "transparent";
        default:
          return e.primary[500];
      }
    }, C = () => {
      if (g) return e.text.disabled;
      switch (r) {
        case "primary":
        case "danger":
          return e.gray[0];
        case "secondary":
          return e.text.primary;
        case "ghost":
        case "text":
          return e.primary[500];
        default:
          return e.gray[0];
      }
    }, v = () => g ? `1px solid ${e.border.default}` : r === "secondary" ? `1px solid ${e.border.default}` : r === "ghost" ? `1px solid ${e.primary[500]}` : "none";
    return /* @__PURE__ */ $(
      "button",
      {
        ref: y,
        className: h(
          "inline-flex items-center justify-center gap-1 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2",
          d
        ),
        disabled: g,
        "aria-disabled": g,
        "aria-busy": t,
        onClick: m,
        style: {
          height: `${z.height}px`,
          padding: z.padding,
          fontSize: z.fontSize,
          fontWeight: S.medium,
          borderRadius: `${b.md}px`,
          backgroundColor: k(),
          color: C(),
          border: v(),
          boxShadow: r === "primary" && !g ? N.sm : N.none,
          width: a || c ? "100%" : "auto",
          cursor: g ? "not-allowed" : "pointer",
          opacity: g ? 0.6 : 1,
          transition: `all ${F.normal} ${R.default}`,
          ...u
        },
        ...x,
        children: [
          t ? /* @__PURE__ */ n(
            "span",
            {
              className: "inline-block",
              style: {
                width: "16px",
                height: "16px",
                border: "2px solid currentColor",
                borderTopColor: "transparent",
                borderRadius: `${b.full}px`,
                animation: "ui-button-spin 1s linear infinite"
              }
            }
          ) : o,
          s
        ]
      }
    );
  }
);
A.displayName = "Button";
const P = {
  large: { height: 48, padding: `0 ${l[4]}px`, fontSize: p.base },
  medium: { height: 40, padding: `0 ${l[3]}px`, fontSize: p.sm },
  small: { height: 32, padding: `0 ${l[2]}px`, fontSize: p.xs }
}, Y = w(
  ({
    label: r,
    inputSize: i = "medium",
    status: o = "default",
    helperText: t,
    prefix: a,
    suffix: c,
    clearable: s = !1,
    className: d,
    style: f,
    value: u,
    onChange: m,
    disabled: x,
    type: y = "text",
    ...g
  }, z) => {
    const [k, C] = j(!1), [v, M] = j(y), B = y === "password", L = () => x ? e.border.default : o === "error" ? e.border.error : o === "success" ? e.border.success : k ? e.border.active : e.border.default, I = () => x ? e.gray[100] : e.gray[0], D = () => {
      m && m({ target: { value: "" } });
    }, H = P[i];
    return /* @__PURE__ */ $("div", { className: h("flex flex-col gap-1", d), style: f, children: [
      r && /* @__PURE__ */ n(
        "label",
        {
          style: {
            fontSize: p.sm,
            fontWeight: S.medium,
            color: x ? e.text.disabled : e.text.primary
          },
          children: r
        }
      ),
      /* @__PURE__ */ $(
        "div",
        {
          className: "flex items-center transition-all",
          style: {
            height: `${H.height}px`,
            padding: H.padding,
            fontSize: H.fontSize,
            borderRadius: `${b.md}px`,
            backgroundColor: I(),
            border: `1px solid ${L()}`,
            transition: `all ${F.normal} ${R.default}`,
            boxShadow: k ? `0 0 0 2px ${e.primary[100]}` : "none"
          },
          children: [
            a && /* @__PURE__ */ n("span", { className: "inline-flex items-center mr-2", style: { color: e.text.secondary }, children: a }),
            /* @__PURE__ */ n(
              "input",
              {
                ref: z,
                type: v,
                value: u,
                onChange: m,
                disabled: x,
                "aria-invalid": o === "error",
                "aria-describedby": t ? `${g.id || "ui-input"}-helper` : void 0,
                className: "flex-1 w-full bg-transparent outline-none text-inherit",
                style: {
                  color: x ? e.text.disabled : e.text.primary
                },
                onFocus: (W) => {
                  C(!0), g.onFocus?.(W);
                },
                onBlur: (W) => {
                  C(!1), g.onBlur?.(W);
                },
                ...g
              }
            ),
            s && u && !x && /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: D,
                className: "inline-flex items-center justify-center ml-2",
                style: {
                  width: "16px",
                  height: "16px",
                  borderRadius: `${b.full}px`,
                  backgroundColor: e.gray[300],
                  color: e.gray[0],
                  fontSize: "10px",
                  border: "none",
                  cursor: "pointer"
                },
                "aria-label": "清除",
                children: "×"
              }
            ),
            B && /* @__PURE__ */ n(
              "button",
              {
                type: "button",
                onClick: () => M(v === "password" ? "text" : "password"),
                className: "inline-flex items-center justify-center ml-2",
                style: {
                  border: "none",
                  background: "none",
                  color: e.text.secondary,
                  cursor: "pointer",
                  fontSize: p.xs
                },
                children: v === "password" ? "显示" : "隐藏"
              }
            ),
            c && !B && /* @__PURE__ */ n("span", { className: "inline-flex items-center ml-2", style: { color: e.text.secondary }, children: c })
          ]
        }
      ),
      t && /* @__PURE__ */ n(
        "span",
        {
          id: `${g.id || "ui-input"}-helper`,
          style: {
            fontSize: p.xs,
            color: o === "error" ? e.danger[500] : o === "success" ? e.success[500] : e.text.secondary
          },
          children: t
        }
      )
    ] });
  }
);
Y.displayName = "Input";
const O = {
  large: { padding: `${l[3]}px ${l[4]}px`, fontSize: p.base, minHeight: 120 },
  medium: { padding: `${l[2]}px ${l[3]}px`, fontSize: p.sm, minHeight: 80 },
  small: { padding: `${l[1.5]}px ${l[2]}px`, fontSize: p.xs, minHeight: 56 }
}, q = w(
  ({
    label: r,
    textareaSize: i = "medium",
    status: o = "default",
    helperText: t,
    className: a,
    style: c,
    disabled: s,
    ...d
  }, f) => {
    const [u, m] = j(!1), x = () => s ? e.border.default : o === "error" ? e.border.error : o === "success" ? e.border.success : u ? e.border.active : e.border.default, y = O[i];
    return /* @__PURE__ */ $("div", { className: h("flex flex-col gap-1", a), style: c, children: [
      r && /* @__PURE__ */ n(
        "label",
        {
          style: {
            fontSize: p.sm,
            fontWeight: S.medium,
            color: s ? e.text.disabled : e.text.primary
          },
          children: r
        }
      ),
      /* @__PURE__ */ n(
        "textarea",
        {
          ref: f,
          disabled: s,
          "aria-invalid": o === "error",
          "aria-describedby": t ? `${d.id || "ui-textarea"}-helper` : void 0,
          className: "w-full bg-transparent outline-none resize-y",
          style: {
            minHeight: y.minHeight,
            padding: y.padding,
            fontSize: y.fontSize,
            borderRadius: `${b.md}px`,
            backgroundColor: s ? e.gray[100] : e.gray[0],
            color: s ? e.text.disabled : e.text.primary,
            border: `1px solid ${x()}`,
            transition: `all ${F.normal} ${R.default}`,
            boxShadow: u ? `0 0 0 2px ${e.primary[100]}` : "none",
            fontFamily: "inherit",
            lineHeight: 1.5
          },
          onFocus: (g) => {
            m(!0), d.onFocus?.(g);
          },
          onBlur: (g) => {
            m(!1), d.onBlur?.(g);
          },
          ...d
        }
      ),
      t && /* @__PURE__ */ n(
        "span",
        {
          id: `${d.id || "ui-textarea"}-helper`,
          style: {
            fontSize: p.xs,
            color: o === "error" ? e.danger[500] : o === "success" ? e.success[500] : e.text.secondary
          },
          children: t
        }
      )
    ] });
  }
);
q.displayName = "Textarea";
const G = {
  none: N.none,
  sm: N.sm,
  md: N.md,
  lg: N.lg,
  xl: N.xl
}, J = w(
  ({
    header: r,
    footer: i,
    shadowLevel: o = "none",
    bordered: t = !1,
    hoverable: a = !1,
    clickable: c = !1,
    children: s,
    className: d,
    style: f,
    onClick: u,
    ...m
  }, x) => {
    const y = c || u !== void 0;
    return /* @__PURE__ */ $(
      "div",
      {
        ref: x,
        className: h(
          "overflow-hidden bg-white transition-all",
          y && "cursor-pointer",
          a && "hover:-translate-y-1",
          d
        ),
        onClick: u,
        style: {
          borderRadius: `${b.lg}px`,
          backgroundColor: e.bg.white,
          boxShadow: G[o],
          border: t ? `1px solid ${e.border.default}` : "none",
          transition: `all ${F.normal} ${R.default}`,
          ...f
        },
        role: y ? "button" : void 0,
        tabIndex: y ? 0 : void 0,
        ...m,
        children: [
          r && /* @__PURE__ */ n(
            "div",
            {
              style: {
                padding: `${l[4]}px ${l[5]}px`,
                borderBottom: `1px solid ${e.border.default}`
              },
              children: r
            }
          ),
          /* @__PURE__ */ n("div", { style: { padding: `${l[5]}px` }, children: s }),
          i && /* @__PURE__ */ n(
            "div",
            {
              style: {
                padding: `${l[4]}px ${l[5]}px`,
                borderTop: `1px solid ${e.border.default}`
              },
              children: i
            }
          )
        ]
      }
    );
  }
);
J.displayName = "Card";
const K = {
  small: { width: 32, fontSize: p.xs },
  medium: { width: 40, fontSize: p.sm },
  large: { width: 56, fontSize: p.lg },
  xlarge: { width: 80, fontSize: p["2xl"] }
}, Q = {
  online: e.success[500],
  offline: e.gray[400],
  busy: e.danger[500],
  away: e.warning[500],
  none: "transparent"
}, U = w(
  ({ src: r, alt: i, text: o, size: t = "medium", status: a = "none", className: c, style: s, ...d }, f) => {
    const u = K[t], m = o ? o.slice(0, 2) : "?";
    return /* @__PURE__ */ $(
      "div",
      {
        ref: f,
        className: h("relative inline-flex items-center justify-center overflow-hidden shrink-0", c),
        style: {
          width: u.width,
          height: u.width,
          borderRadius: b.full,
          backgroundColor: e.primary[100],
          color: e.primary[600],
          fontSize: u.fontSize,
          fontWeight: S.medium,
          ...s
        },
        ...d,
        children: [
          r ? /* @__PURE__ */ n(
            "img",
            {
              src: r,
              alt: i || o || "头像",
              className: "w-full h-full object-cover",
              onError: (x) => {
                x.currentTarget.style.display = "none";
              }
            }
          ) : /* @__PURE__ */ n("span", { children: m }),
          a !== "none" && /* @__PURE__ */ n(
            "span",
            {
              style: {
                position: "absolute",
                bottom: 0,
                right: 0,
                width: u.width / 4,
                height: u.width / 4,
                borderRadius: b.full,
                backgroundColor: Q[a],
                border: `2px solid ${e.bg.white}`
              }
            }
          )
        ]
      }
    );
  }
);
U.displayName = "Avatar";
const V = {
  primary: { color: e.primary[600], bg: e.primary[50] },
  success: { color: e.success[600], bg: e.success[50] },
  warning: { color: e.warning[600], bg: e.warning[50] },
  danger: { color: e.danger[600], bg: e.danger[50] },
  info: { color: e.info[600], bg: e.info[50] },
  default: { color: e.text.secondary, bg: e.gray[100] }
}, X = w(
  ({ variant: r = "default", children: i, className: o, style: t, ...a }, c) => {
    const s = V[r];
    return /* @__PURE__ */ n(
      "span",
      {
        ref: c,
        className: h("inline-flex items-center", o),
        style: {
          padding: `${l[0.5]}px ${l[2]}px`,
          fontSize: p.xs,
          fontWeight: S.medium,
          borderRadius: `${b.sm}px`,
          backgroundColor: s.bg,
          color: s.color,
          ...t
        },
        ...a,
        children: i
      }
    );
  }
);
X.displayName = "Tag";
const Z = {
  primary: e.primary[500],
  success: e.success[500],
  warning: e.warning[500],
  danger: e.danger[500],
  info: e.info[500],
  default: e.gray[500]
}, _ = w(
  ({ count: r, maxCount: i = 99, dot: o = !1, status: t = "danger", children: a, className: c, style: s, ...d }, f) => {
    const u = Z[t];
    if (o)
      return /* @__PURE__ */ $(
        "span",
        {
          ref: f,
          className: h("relative inline-flex", c),
          style: s,
          ...d,
          children: [
            a,
            /* @__PURE__ */ n(
              "span",
              {
                style: {
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  width: "8px",
                  height: "8px",
                  borderRadius: b.full,
                  backgroundColor: u
                }
              }
            )
          ]
        }
      );
    if (r !== void 0) {
      const m = r > i ? `${i}+` : r;
      return /* @__PURE__ */ n(
        "span",
        {
          ref: f,
          className: h("inline-flex items-center justify-center text-white", c),
          style: {
            minWidth: "18px",
            height: "18px",
            padding: "0 5px",
            fontSize: p.xs,
            fontWeight: S.medium,
            borderRadius: b.full,
            backgroundColor: u,
            ...s
          },
          ...d,
          children: m
        }
      );
    }
    return /* @__PURE__ */ n(
      "span",
      {
        ref: f,
        className: h("inline-flex items-center justify-center px-2 py-0.5 text-white", c),
        style: {
          fontSize: p.xs,
          fontWeight: S.medium,
          borderRadius: `${b.sm}px`,
          backgroundColor: u,
          ...s
        },
        ...d,
        children: a
      }
    );
  }
);
_.displayName = "Badge";
const ee = w(
  ({ direction: r = "horizontal", dashed: i = !1, text: o, className: t, style: a, ...c }, s) => {
    const d = i ? "dashed" : "solid";
    return r === "vertical" ? /* @__PURE__ */ n(
      "div",
      {
        ref: s,
        className: h("inline-block align-middle", t),
        style: {
          width: "1px",
          height: "1em",
          margin: `0 ${l[2]}px`,
          borderLeft: `1px ${d} ${e.border.default}`,
          ...a
        },
        ...c
      }
    ) : /* @__PURE__ */ $(
      "div",
      {
        ref: s,
        className: h("flex items-center w-full", t),
        style: {
          margin: `${l[3]}px 0`,
          ...a
        },
        ...c,
        children: [
          /* @__PURE__ */ n(
            "div",
            {
              style: {
                flex: 1,
                borderTop: `1px ${d} ${e.border.default}`
              }
            }
          ),
          o && /* @__PURE__ */ n(
            "span",
            {
              style: {
                padding: `0 ${l[3]}px`,
                color: e.text.secondary,
                fontSize: "inherit"
              },
              children: o
            }
          ),
          /* @__PURE__ */ n(
            "div",
            {
              style: {
                flex: 1,
                borderTop: `1px ${d} ${e.border.default}`
              }
            }
          )
        ]
      }
    );
  }
);
ee.displayName = "Divider";
const re = {
  small: { size: 20, dot: 4 },
  medium: { size: 32, dot: 6 },
  large: { size: 48, dot: 8 }
}, oe = w(
  ({ type: r = "circle", size: i = "medium", text: o, fullScreen: t = !1, className: a, style: c, ...s }, d) => {
    const f = re[i], u = () => /* @__PURE__ */ n(
      "div",
      {
        style: {
          width: f.size,
          height: f.size,
          borderRadius: b.full,
          border: `3px solid ${e.gray[200]}`,
          borderTopColor: e.primary[500],
          animation: "ui-loading-spin 1s linear infinite"
        }
      }
    ), m = () => /* @__PURE__ */ n("div", { className: "flex items-center gap-1", style: { height: f.size }, children: [0, 1, 2].map((g) => /* @__PURE__ */ n(
      "span",
      {
        style: {
          width: f.dot,
          height: f.dot,
          borderRadius: b.full,
          backgroundColor: e.primary[500],
          animation: `ui-loading-bounce 1.4s ${R.default} ${g * 0.16}s infinite both`
        }
      },
      g
    )) }), x = () => /* @__PURE__ */ $(
      "svg",
      {
        width: f.size,
        height: f.size,
        viewBox: "0 0 50 50",
        style: { animation: "ui-loading-spin 1s linear infinite" },
        children: [
          /* @__PURE__ */ n(
            "circle",
            {
              cx: "25",
              cy: "25",
              r: "20",
              fill: "none",
              stroke: e.gray[200],
              strokeWidth: "4"
            }
          ),
          /* @__PURE__ */ n(
            "circle",
            {
              cx: "25",
              cy: "25",
              r: "20",
              fill: "none",
              stroke: e.primary[500],
              strokeWidth: "4",
              strokeLinecap: "round",
              strokeDasharray: "80",
              strokeDashoffset: "60"
            }
          )
        ]
      }
    ), y = /* @__PURE__ */ $(
      "div",
      {
        ref: d,
        className: h("inline-flex flex-col items-center justify-center gap-2", a),
        style: {
          color: e.text.secondary,
          fontSize: p.sm,
          ...c
        },
        ...s,
        children: [
          r === "circle" && u(),
          r === "dots" && m(),
          r === "spinner" && x(),
          o && /* @__PURE__ */ n("span", { children: o })
        ]
      }
    );
    return t ? /* @__PURE__ */ n(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center",
        style: {
          backgroundColor: e.bg.overlay,
          backdropFilter: "blur(2px)"
        },
        children: y
      }
    ) : y;
  }
);
oe.displayName = "Loading";
const te = w(
  ({ variant: r = "text", width: i, height: o, animated: t = !0, className: a, style: c, ...s }, d) => {
    const f = () => {
      switch (r) {
        case "circular":
          return b.full;
        case "rounded":
          return b.md;
        case "rectangular":
          return b.none;
        case "text":
        default:
          return b.sm;
      }
    };
    return /* @__PURE__ */ n(
      "div",
      {
        ref: d,
        className: h("bg-gray-200", t && "animate-pulse", a),
        style: {
          width: i ?? (r === "text" ? "100%" : void 0),
          height: o ?? (r === "text" ? 16 : void 0),
          borderRadius: f(),
          backgroundColor: e.gray[200],
          backgroundImage: t ? `linear-gradient(90deg, ${e.gray[200]} 25%, ${e.gray[100]} 50%, ${e.gray[200]} 75%)` : void 0,
          backgroundSize: "200% 100%",
          animation: t ? `ui-skeleton-shimmer 1.5s ${R.default} infinite` : void 0,
          ...c
        },
        ...s
      }
    );
  }
);
te.displayName = "Skeleton";
const ne = w(
  ({ icon: r, title: i = "暂无数据", description: o, children: t, className: a, style: c, ...s }, d) => /* @__PURE__ */ $(
    "div",
    {
      ref: d,
      className: h("flex flex-col items-center justify-center text-center", a),
      style: {
        padding: `${l[8]}px ${l[4]}px`,
        ...c
      },
      ...s,
      children: [
        r ? /* @__PURE__ */ n("div", { style: { marginBottom: l[4], color: e.text.disabled }, children: r }) : /* @__PURE__ */ $(
          "svg",
          {
            width: "64",
            height: "64",
            viewBox: "0 0 64 64",
            fill: "none",
            style: { marginBottom: l[4], color: e.gray[300] },
            children: [
              /* @__PURE__ */ n(
                "path",
                {
                  d: "M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8z",
                  stroke: "currentColor",
                  strokeWidth: "2"
                }
              ),
              /* @__PURE__ */ n("path", { d: "M22 32h20M32 22v20", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
            ]
          }
        ),
        i && /* @__PURE__ */ n(
          "div",
          {
            style: {
              fontSize: p.base,
              fontWeight: S.medium,
              color: e.text.primary,
              marginBottom: l[1]
            },
            children: i
          }
        ),
        o && /* @__PURE__ */ n(
          "div",
          {
            style: {
              fontSize: p.sm,
              color: e.text.secondary,
              marginBottom: l[4]
            },
            children: o
          }
        ),
        t
      ]
    }
  )
);
ne.displayName = "Empty";
const ie = {
  square: 0,
  rounded: 10,
  circle: 9999
}, ae = w(
  ({
    src: r,
    alt: i = "",
    width: o,
    height: t,
    fit: a = "cover",
    shape: c = "rounded",
    fallback: s,
    placeholder: d,
    lazy: f = !1,
    className: u,
    style: m,
    onLoad: x,
    onError: y,
    ...g
  }, z) => {
    const [k, C] = j(!1), [v, M] = j(!1);
    return /* @__PURE__ */ $(
      "div",
      {
        className: h("relative overflow-hidden inline-block", u),
        style: {
          width: o,
          height: t,
          borderRadius: ie[c],
          backgroundColor: e.gray[100],
          ...m
        },
        children: [
          !k && !v && d,
          v ? s || /* @__PURE__ */ n(
            "div",
            {
              className: "flex items-center justify-center w-full h-full",
              style: { color: e.text.disabled, fontSize: 12 },
              children: "加载失败"
            }
          ) : /* @__PURE__ */ n(
            "img",
            {
              ref: z,
              src: r,
              alt: i,
              loading: f ? "lazy" : "eager",
              className: h("w-full h-full transition-opacity", k ? "opacity-100" : "opacity-0"),
              style: { objectFit: a },
              onLoad: (B) => {
                C(!0), x?.(B);
              },
              onError: (B) => {
                M(!0), C(!0), y?.(B);
              },
              ...g
            }
          )
        ]
      }
    );
  }
);
ae.displayName = "Image";
export {
  U as Avatar,
  _ as Badge,
  A as Button,
  J as Card,
  ee as Divider,
  ne as Empty,
  ae as Image,
  Y as Input,
  oe as Loading,
  te as Skeleton,
  X as Tag,
  q as Textarea,
  e as color,
  de as darkColor,
  F as duration,
  R as easing,
  ue as fontFamily,
  p as fontSize,
  S as fontWeight,
  pe as keyframes,
  fe as letterSpacing,
  ce as lineHeight,
  b as radius,
  N as shadow,
  l as spacing
};
//# sourceMappingURL=index.js.map
