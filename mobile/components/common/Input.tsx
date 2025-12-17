import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from "react-native";
import Colors from "../../constants/Colors";
import { Typography } from "../../constants/Typography";

/**
 * Reusable Input Component
 * Standardizes text entry fields with labels, validation states, and password toggling.
 */

interface InputProps extends TextInputProps {
  label?: string;
  error?: string | null;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  secureTextEntry,
  containerStyle,
  style,
  multiline,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Toggle password visibility locally
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Determine border color based on state
  const getBorderColor = () => {
    if (error) return Colors.light.error;
    if (isFocused) return Colors.light.primary;
    return "#E0E0E0"; // Light gray default
  };

  const isPassword = secureTextEntry && !isPasswordVisible;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          { borderColor: getBorderColor(), height: multiline ? 120 : 48 },
        ]}
      >
        <TextInput
          style={[styles.input, multiline && styles.multilineInput, style]}
          secureTextEntry={isPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={Colors.light.textPlaceholder}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          accessibilityLabel={label}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.eyeText}>
              {isPasswordVisible ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    ...Typography.bodySmall,
    color: Colors.light.text,
    marginBottom: 6,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: Colors.light.neutral,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.light.text,
    height: "100%",
  },
  multilineInput: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  eyeIcon: {
    paddingLeft: 8,
  },
  eyeText: {
    ...Typography.caption,
    color: Colors.light.primary,
    fontWeight: "600",
  },
  errorText: {
    ...Typography.caption,
    color: Colors.light.error,
    marginTop: 4,
  },
});
