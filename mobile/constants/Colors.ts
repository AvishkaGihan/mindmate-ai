/**
 * Color Palette System
 * Based on the UX Design Specification.
 * Used for maintaining a consistent theme across the application.
 */

const tintColorLight = "#1BA098";
const tintColorDark = "#1BA098"; // Using the same teal for now, could be adjusted for contrast

export default {
  light: {
    text: "#2C3E50",
    background: "#F5F1ED",
    tint: tintColorLight,
    tabIconDefault: "#7F8C8D",
    tabIconSelected: tintColorLight,

    // Core Brand Colors
    primary: "#1BA098", // Teal Accent
    secondary: "#159087", // Darker Teal
    neutral: "#FFFFFF", // Clean White
    warmBeige: "#F5F1ED", // Warm Background

    // Feedback
    success: "#27AE60",
    warning: "#F39C12",
    error: "#E74C3C",
    disabled: "#BDC3C7",

    // Text Hierarchy
    textPrimary: "#2C3E50",
    textSecondary: "#7F8C8D",
    textPlaceholder: "#ECF0F1",

    // Mood Colors (Specific to UX Spec)
    moods: {
      peaceful: "#A8D8EA", // Light Blue
      content: "#FFEAA7", // Warm Yellow
      anxious: "#FFB7B2", // Soft Coral
      stressed: "#FF6B6B", // Deep Red
      sad: "#74B9FF", // Deep Blue
      angry: "#E17055", // Warm Orange
      overwhelmed: "#A29BFE", // Purple
    },
  },
  dark: {
    text: "#F5F1ED",
    background: "#121212",
    tint: tintColorDark,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,

    // Core Brand Colors
    primary: "#1BA098", // Keep distinct teal even in dark mode
    secondary: "#159087",
    neutral: "#1E1E1E", // Dark Card Background
    warmBeige: "#121212", // Main Background

    // Feedback
    success: "#27AE60",
    warning: "#F39C12",
    error: "#CF6679", // Lighter red for dark mode contrast
    disabled: "#4A4A4A",

    // Text Hierarchy
    textPrimary: "#F5F1ED", // Off-white
    textSecondary: "#B0B3B8",
    textPlaceholder: "#3A3B3C",

    // Mood Colors (Slightly muted for dark mode if needed, keeping same for recognition)
    moods: {
      peaceful: "#A8D8EA",
      content: "#FFEAA7",
      anxious: "#FFB7B2",
      stressed: "#FF6B6B",
      sad: "#74B9FF",
      angry: "#E17055",
      overwhelmed: "#A29BFE",
    },
  },
};
