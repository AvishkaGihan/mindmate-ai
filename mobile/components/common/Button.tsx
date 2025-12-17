import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import Colors from "../../constants/Colors";
import { Typography } from "../../constants/Typography";

/**
 * Reusable Button Component
 * Enforces Design System styling for buttons.
 */

export type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost";
export type ButtonSize = "small" | "medium" | "large";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "large",
  disabled = false,
  isLoading = false,
  iconLeft,
  iconRight,
  style,
}) => {
  // Determine Colors based on variant
  const getBackgroundColor = () => {
    if (disabled) return Colors.light.disabled;
    switch (variant) {
      case "primary":
        return Colors.light.primary;
      case "secondary":
        return "transparent";
      case "destructive":
        return Colors.light.error;
      case "ghost":
        return "transparent";
      default:
        return Colors.light.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return Colors.light.textPlaceholder;
    switch (variant) {
      case "primary":
        return Colors.light.neutral;
      case "secondary":
        return Colors.light.primary;
      case "destructive":
        return Colors.light.neutral;
      case "ghost":
        return Colors.light.textSecondary;
      default:
        return Colors.light.neutral;
    }
  };

  const getBorder = () => {
    if (variant === "secondary" && !disabled) {
      return { borderWidth: 1, borderColor: Colors.light.primary };
    }
    return {};
  };

  // Determine Dimensions based on size
  const getHeight = () => {
    switch (size) {
      case "large":
        return 48;
      case "medium":
        return 44;
      case "small":
        return 32;
      default:
        return 48;
    }
  };

  const containerStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    height: getHeight(),
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    opacity: disabled ? 0.7 : 1,
    ...getBorder(),
    ...style,
  };

  const textStyle: TextStyle = {
    ...Typography.button,
    color: getTextColor(),
    fontSize: size === "small" ? 14 : 16,
    marginLeft: iconLeft ? 8 : 0,
    marginRight: iconRight ? 8 : 0,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      style={containerStyle}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {iconLeft && <View>{iconLeft}</View>}
          <Text style={textStyle}>{title}</Text>
          {iconRight && <View>{iconRight}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};
