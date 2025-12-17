import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { Typography as TypoConstants } from "../../constants/Typography";
import Colors from "../../constants/Colors";

/**
 * Typography Component
 * A centralized Text wrapper that enforces the design system's typography scale and font families.
 * * Usage:
 * <Typography variant="h1">Heading</Typography>
 * <Typography variant="body" color="#FF0000">Red Text</Typography>
 */

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "bodySemiBold"
  | "bodySmall"
  | "caption"
  | "button";

interface TypographyProps extends TextProps {
  /** The typography style variant to apply. Defaults to 'body'. */
  variant?: TypographyVariant;
  /** Optional color override. Defaults to theme text color. */
  color?: string;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  color,
  style,
  children,
  ...props
}) => {
  // 1. Get the base style definition from constants
  const variantStyle = TypoConstants[variant] || TypoConstants.body;

  // 2. Determine final text color
  // Priority: Prop override > Variant specific color > Theme default text color
  const textColor = color || variantStyle.color || Colors.light.text;

  // 3. Merge styles
  const combinedStyle: TextStyle = {
    ...variantStyle,
    color: textColor,
    ...(style as object),
  };

  return (
    <Text style={combinedStyle} {...props}>
      {children}
    </Text>
  );
};

export default Typography;
