import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ViewStyle,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Typography } from "../common/Typography";
import Colors from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";
import { ChatMessage } from "../../types";
import { formatTime } from "../../utils/dateTime";

/**
 * ChatBubble Component
 * Renders a single message in the conversation timeline.
 * Distinguishes visually between User (Right/Teal) and AI (Left/Gray).
 */

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";
  const isError = message.isError;

  // Interaction: Long press to copy
  const handleLongPress = async () => {
    Alert.alert("Message Options", "What would you like to do?", [
      {
        text: "Copy Text",
        onPress: async () => {
          await Clipboard.setStringAsync(message.content);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // Dynamic Styles based on Role
  const containerStyle: ViewStyle = {
    alignSelf: isUser ? "flex-end" : "flex-start",
    backgroundColor: isUser
      ? Colors.light.primary
      : isError
      ? "#FFEBEE" // Light red for error
      : Colors.light.neutral,
    borderBottomRightRadius: isUser ? 0 : 16,
    borderBottomLeftRadius: isUser ? 16 : 0,
    marginLeft: isUser ? Spacing.lg : 0,
    marginRight: isUser ? 0 : Spacing.lg,
    // Add border for AI messages to stand out against background
    borderWidth: isUser ? 0 : 1,
    borderColor: isError ? Colors.light.error : "#E0E0E0",
  };

  const textColor = isUser ? "#FFFFFF" : Colors.light.text;
  const timeColor = isUser
    ? "rgba(255, 255, 255, 0.7)"
    : Colors.light.textSecondary;

  return (
    <View
      style={[
        styles.wrapper,
        { alignItems: isUser ? "flex-end" : "flex-start" },
      ]}
    >
      {/* AI Avatar Label (Visual Anchor) */}
      {!isUser && (
        <Typography
          variant="caption"
          color={Colors.light.textSecondary}
          style={styles.senderName}
        >
          MindMate
        </Typography>
      )}

      <TouchableOpacity
        onLongPress={handleLongPress}
        delayLongPress={500}
        activeOpacity={0.9}
        style={[styles.bubble, containerStyle]}
      >
        <Typography
          variant="body"
          color={Colors.light.text}
          style={{ color: isError ? Colors.light.error : textColor }}
        >
          {message.content}
        </Typography>

        <View style={styles.footer}>
          <Typography
            variant="caption"
            style={{ color: timeColor, fontSize: 10 }}
          >
            {formatTime(message.timestamp)}
          </Typography>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
    width: "100%",
  },
  senderName: {
    marginLeft: 4,
    marginBottom: 4,
  },
  bubble: {
    padding: 12,
    borderRadius: 16, // Top-left and Top-right usually rounded
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxWidth: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  footer: {
    alignSelf: "flex-end",
    marginTop: 4,
  },
});
