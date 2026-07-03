export const fontFamilies = {
  sans: '"PingFang SC", "HarmonyOS Sans SC", "Noto Sans SC", sans-serif',
  mono: '"DIN", monospace',
};

export const fontSizes = {
  display: 32,
  h1: 28,
  h2: 24,
  h3: 20,
  title: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
  mini: 10,
};

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export const lineHeights = {
  16: 24,
  20: 28,
  24: 32,
  28: 40,
};

export const font = {
  display: {
    size: fontSizes.display,
    weight: fontWeights.bold,
    lineHeight: lineHeights[28],
  },
  h1: {
    size: fontSizes.h1,
    weight: fontWeights.semibold,
    lineHeight: lineHeights[28],
  },
  h2: {
    size: fontSizes.h2,
    weight: fontWeights.semibold,
    lineHeight: lineHeights[24],
  },
  h3: {
    size: fontSizes.h3,
    weight: fontWeights.semibold,
    lineHeight: lineHeights[24],
  },
  title: {
    size: fontSizes.title,
    weight: fontWeights.semibold,
    lineHeight: lineHeights[24],
  },
  body: {
    size: fontSizes.body,
    weight: fontWeights.regular,
    lineHeight: lineHeights[24],
  },
  bodySmall: {
    size: fontSizes.bodySmall,
    weight: fontWeights.regular,
    lineHeight: lineHeights[20],
  },
  caption: {
    size: fontSizes.caption,
    weight: fontWeights.medium,
    lineHeight: lineHeights[16],
  },
  mini: {
    size: fontSizes.mini,
    weight: fontWeights.regular,
    lineHeight: lineHeights[16],
  },
};