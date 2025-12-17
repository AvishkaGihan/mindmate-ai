import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import Colors from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { Typography } from "../common/Typography";

/**
 * ChatInput Component
 * The fixed bottom input area for the chat screen.
 * Features auto-expanding text input and a send button state management.
 */

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading = false,
}) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmed = text.trim();
    if (trimmed && !isLoading) {
      onSend(trimmed);
      setText("");
    }
  };

  const isValid = text.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={Colors.light.textPlaceholder}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={1000}
          editable={!isLoading}
          textAlignVertical="center"
        />
      </View>

      <TouchableOpacity
        onPress={handleSend}
        disabled={!isValid || isLoading}
        style={[
          styles.sendButton,
          (!isValid || isLoading) && styles.sendButtonDisabled,
        ]}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          // Simple arrow icon using text for MVP, replace with Icon SVG in production
          <Typography
            variant="bodySemiBold"
            color="#FFFFFF"
            style={{ fontSize: 18, lineHeight: 22 }}
          >
            ➤
          </Typography>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end", // Align bottom so button stays down when input grows
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.light.neutral,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 6, // Adjustment for Android multiline padding
    marginRight: Spacing.sm,
    minHeight: 48,
    maxHeight: 120, // Limit growth
    justifyContent: "center",
  },
  input: {
    fontSize: 16,
    color: Colors.light.text,
    fontFamily: "Inter", // Assuming Inter is loaded
    paddingTop: 0,
    paddingBottom: 0,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
    // Push visual weight slightly to center the arrow
    paddingLeft: 2,
    paddingBottom: 2,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.light.disabled,
  },
});
