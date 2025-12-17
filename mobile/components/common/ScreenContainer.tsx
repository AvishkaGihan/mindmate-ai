import React from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Colors from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { LoadingSpinner } from "./LoadingSpinner";

/**
 * ScreenContainer Component
 * The root wrapper for every screen. Handles safe areas, keyboard interactions,
 * and standard layout padding.
 */

interface ScreenContainerProps {
  children: React.ReactNode;
  /** Whether the screen content should be scrollable. Defaults to false. */
  scrollable?: boolean;
  /** Whether the screen is currently loading data. Defaults to false. */
  isLoading?: boolean;
  /** Optional custom styles for the content container */
  style?: ViewStyle;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  isLoading = false,
  style,
}) => {
  // Common content styles with standard padding
  const contentStyle: ViewStyle = {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    ...style,
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  const Wrapper = scrollable ? ScrollView : View;
  const wrapperProps = scrollable
    ? {
        contentContainerStyle: {
          flexGrow: 1,
          paddingHorizontal: Spacing.sm,
          ...style,
        },
        keyboardShouldPersistTaps: "handled" as const,
        showsVerticalScrollIndicator: false,
      }
    : {
        style: contentStyle,
      };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* StatusBar configuration:
        'dark' style works best on light backgrounds (our default).
        Background color handles Android transparency.
      */}
      <StatusBar style="dark" backgroundColor={Colors.light.background} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <Wrapper {...wrapperProps}>{children}</Wrapper>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardView: {
    flex: 1,
  },
});

export default ScreenContainer;
