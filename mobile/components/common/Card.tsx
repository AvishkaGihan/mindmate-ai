import React from "react";
import { View, StyleSheet, ViewStyle, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import { Shadows } from "../../constants/Layout";

/**
 * Reusable Card Component
 * Implements the "Card" metaphor from the design system.
 * Provides consistent spacing, border radius, and elevation.
 */

type CardVariant = "elevated" | "outlined" | "flat";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: CardVariant;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = "elevated",
  onPress,
}) => {
  // Determine base styles based on variant
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case "elevated":
        return {
          backgroundColor: Colors.light.neutral,
          ...Shadows.small, // Level 1 shadow
          borderWidth: 0,
        };
      case "outlined":
        return {
          backgroundColor: Colors.light.neutral,
          borderWidth: 1,
          borderColor: "#E0E0E0",
          // No shadow
        };
      case "flat":
        return {
          backgroundColor: "#F5F5F5", // Slightly darker than neutral
          borderWidth: 0,
        };
      default:
        return {};
    }
  };

  const containerStyles = [styles.container, getVariantStyle(), style];

  // If onPress is provided, make it interactive
  if (onPress) {
    return (
      <TouchableOpacity
        style={containerStyles}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  // Otherwise just a View
  return <View style={containerStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: "100%",
  },
});
