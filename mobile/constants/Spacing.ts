/**
 * Spacing Constants
 * Implements the 8px grid system defined in the UX Specification.
 * These values should be used for margins, paddings, and gaps to ensure visual consistency.
 */

export const Spacing = {
  /** 4px - Micro spacing for tight groupings */
  xxs: 4,

  /** 8px - The base unit (xs) */
  xs: 8,

  /** 16px - Standard spacing (sm) */
  sm: 16,

  /** 24px - Section separation (md) */
  md: 24,

  /** 32px - Major layout breaks (lg) */
  lg: 32,

  /** 48px - Large containers or hero sections (xl) */
  xl: 48,

  /** 64px - Excessive spacing for distinct separation (xxl) */
  xxl: 64,
} as const;

export type SpacingType = keyof typeof Spacing;

export default Spacing;
