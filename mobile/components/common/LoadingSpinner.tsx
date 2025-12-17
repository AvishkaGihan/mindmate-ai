import React from "react";
import { View, ActivityIndicator, StyleSheet, ViewStyle } from "react-native";
import Colors from "../../constants/Colors";

/**
 * LoadingSpinner Component
 * Standardized loading indicator for the application.
 * Centers the spinner within its container by default.
 */

interface LoadingSpinnerProps {
  /** Size of the spinner. Defaults to 'large'. */
  size?: "small" | "large";
  /** Optional color override. Defaults to primary Teal. */
  color?: string;
  /** Optional style override for the container */
  style?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
  color,
  style,
}) => {
  const spinnerColor = color || Colors.light.primary;

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator
        size={size}
        color={spinnerColor}
        accessibilityLabel="Loading"
        testID="loading-spinner"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 100, // Ensure enough touch/visual area if used in a restricted container
  },
});

export default LoadingSpinner;
