import { Dimensions, Platform, ViewStyle } from "react-native";
import { Spacing } from "./Spacing";

const { width, height } = Dimensions.get("window");

/**
 * Layout Constants
 * Provides global dimension access and responsive breakpoints.
 */

// Breakpoint for small devices (e.g., iPhone SE, older Androids)
const isSmallDevice = width < 375;

export const Layout = {
  window: {
    width,
    height,
  },
  isSmallDevice,
};

/**
 * Shared Shadow Styles
 * Unifies elevation (Android) and shadow properties (iOS).
 * Based on the UX Design System's elevation levels.
 */
export const Shadows = {
  /** Level 1: Cards, buttons */
  small: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  } as ViewStyle,

  /** Level 2: Elevated cards, modals */
  medium: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  } as ViewStyle,

  /** Level 3: Floating actions, important dialogs */
  large: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  } as ViewStyle,
};

/**
 * Common Layout Patterns
 * Reusable Flexbox configurations to reduce stylesheet boilerplate.
 */
export const CommonStyles = {
  /** Standard screen container with horizontal padding */
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  } as ViewStyle,

  /** Center content both vertically and horizontally */
  centered: {
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,

  /** Horizontal row with centered alignment */
  row: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,

  /** Horizontal row with space between elements */
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  } as ViewStyle,
};

export default Layout;
