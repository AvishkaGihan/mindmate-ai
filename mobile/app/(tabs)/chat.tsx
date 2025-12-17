import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Platform } from "react-native";
import { ScreenContainer } from "../../components/common/ScreenContainer";
import { ChatBubble } from "../../components/chat/ChatBubble";
import { ChatInput } from "../../components/chat/ChatInput";
import { Typography } from "../../components/common/Typography";
import { useChatStore } from "../../stores/chatStore";
import { offlineSyncService } from "../../services/offlineSync";
import Colors from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";

/**
 * Chat Screen
 * The primary interface for AI interactions.
 * Features:
 * - Real-time typing indicators
 * - Offline status handling
 * - Auto-scrolling message list
 */

export default function ChatScreen() {
  const { messages, isTyping, sendMessage, loadHistory } = useChatStore();
  const [isConnected, setIsConnected] = useState(true);

  // Track offline status
  useEffect(() => {
    // Initial check
    setIsConnected(offlineSyncService.getIsConnected());

    // Subscribe to changes
    const unsubscribe = offlineSyncService.subscribe((connected) => {
      setIsConnected(connected);
    });

    // Load previous chat history on mount
    loadHistory();

    return () => unsubscribe();
  }, [loadHistory]);

  const handleSend = async (text: string) => {
    if (!isConnected) {
      // Optional: You could allow local echoing, but for now we block sending
      // or rely on the store to handle the error.
      // The input is usually disabled if isTyping, but here we check connection.
    }
    await sendMessage(text);
  };

  // Render the "Thinking..." indicator as a footer in the inverted list
  // (which appears at the visual bottom)
  const renderFooter = () => {
    if (!isTyping) return <View style={{ height: Spacing.sm }} />;

    return (
      <View style={styles.typingContainer}>
        <View style={styles.dot} />
        <View style={[styles.dot, { animationDelay: "0.2s" } as any]} />
        <View style={[styles.dot, { animationDelay: "0.4s" } as any]} />
        <Typography
          variant="caption"
          color={Colors.light.textSecondary}
          style={{ marginLeft: 8 }}
        >
          MindMate is thinking...
        </Typography>
      </View>
    );
  };

  return (
    <ScreenContainer style={styles.container}>
      {/* Offline Banner */}
      {!isConnected && (
        <View style={styles.offlineBanner}>
          <Typography variant="caption" color="#FFFFFF">
            You are offline. Chat features are unavailable.
          </Typography>
        </View>
      )}

      {/* Message List */}
      <FlatList
        data={[...messages].reverse()} // Reverse copy for inverted list
        renderItem={({ item }) => <ChatBubble message={item} />}
        keyExtractor={(item) => item.id}
        inverted // Messages build from bottom up
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderFooter} // Inverted: Header is visually at the bottom
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      />

      {/* Input Area */}
      <ChatInput onSend={handleSend} isLoading={isTyping || !isConnected} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0, // Override default padding to allow full-width input
    paddingBottom: Platform.OS === "android" ? Spacing.sm : 0,
  },
  offlineBanner: {
    backgroundColor: Colors.light.warning,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    alignItems: "center",
    width: "100%",
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    marginLeft: Spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.textSecondary,
    marginRight: 4,
    opacity: 0.6,
  },
});
