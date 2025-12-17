import { TextStyle } from "react-native";

/**
 * Typography System
 * Enforces the design system's font choices and scaling.
 * * Font Families:
 * - Primary: Inter (Clean, modern, accessible)
 * - Display: Playfair Display (Warm, elegant, used for affirmations/headers)
 */

const fonts = {
  primary: {
    regular: "Inter-Regular",
    medium: "Inter-Medium",
    semiBold: "Inter-SemiBold",
    bold: "Inter-Bold",
  },
  display: {
    regular: "PlayfairDisplay-Regular",
    bold: "PlayfairDisplay-Bold",
  },
};

const sizes = {
  h1: 32,
  h2: 24,
  h3: 20,
  body: 16,
  bodySmall: 14,
  caption: 12,
  button: 16,
};

const lineHeights = {
  h1: 40,
  h2: 32,
  h3: 28,
  body: 24,
  bodySmall: 20,
  caption: 16,
  button: 24,
};

// Pre-defined text styles for use in StyleSheet
export const Typography: Record<string, TextStyle> = {
  // Headings
  h1: {
    fontFamily: fonts.display.bold,
    fontSize: sizes.h1,
    lineHeight: lineHeights.h1,
    color: "#2C3E50", // Default, can be overridden
  },
  h2: {
    fontFamily: fonts.primary.semiBold,
    fontSize: sizes.h2,
    lineHeight: lineHeights.h2,
    color: "#2C3E50",
  },
  h3: {
    fontFamily: fonts.primary.medium,
    fontSize: sizes.h3,
    lineHeight: lineHeights.h3,
    color: "#2C3E50",
  },

  // Body Text
  body: {
    fontFamily: fonts.primary.regular,
    fontSize: sizes.body,
    lineHeight: lineHeights.body,
    color: "#2C3E50",
  },
  bodySemiBold: {
    fontFamily: fonts.primary.semiBold,
    fontSize: sizes.body,
    lineHeight: lineHeights.body,
    color: "#2C3E50",
  },
  bodySmall: {
    fontFamily: fonts.primary.regular,
    fontSize: sizes.bodySmall,
    lineHeight: lineHeights.bodySmall,
    color: "#7F8C8D",
  },

  // Functional
  caption: {
    fontFamily: fonts.primary.medium,
    fontSize: sizes.caption,
    lineHeight: lineHeights.caption,
    color: "#7F8C8D",
  },
  button: {
    fontFamily: fonts.primary.semiBold,
    fontSize: sizes.button,
    lineHeight: lineHeights.button,
    letterSpacing: 0.5,
  },
};

export default { fonts, sizes, lineHeights, Typography };
