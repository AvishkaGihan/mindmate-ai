import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInputSelectionChangeEvent,
  ViewStyle,
} from "react-native";
import { Input } from "../common/Input";
import { Typography } from "../common/Typography";
import Colors from "../../constants/Colors";
import { Spacing } from "../../constants/Spacing";

/**
 * RichTextEditor Component
 * Core journaling input.
 * * Features:
 * - Markdown-based basic formatting (Bold, Italic)
 * - Word count tracking
 * - Dynamic AI prompt display
 * - Selection tracking for inserting formatting
 */

interface RichTextEditorProps {
  value: string;
  onChangeText: (text: string) => void;
  isEditable?: boolean;
  aiPrompt?: string | null;
  style?: ViewStyle;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChangeText,
  isEditable = true,
  aiPrompt,
  style,
}) => {
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  // Calculate word count
  const wordCount = value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
  const maxWords = 500; // Soft limit for visual indicator

  // Handle selection changes to know where to insert markdown
  const handleSelectionChange = (event: TextInputSelectionChangeEvent) => {
    setSelection(event.nativeEvent.selection);
  };

  /**
   * Inserts markdown syntax at the current cursor position
   * or wraps selected text.
   */
  const insertFormat = (syntax: string) => {
    const start = selection.start;
    const end = selection.end;

    // Check if text is selected
    if (start !== end) {
      const selectedText = value.substring(start, end);
      const newText =
        value.substring(0, start) +
        `${syntax}${selectedText}${syntax}` +
        value.substring(end);
      onChangeText(newText);
    } else {
      // Just insert at cursor
      const newText =
        value.substring(0, start) + `${syntax}` + value.substring(end);
      onChangeText(newText);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Formatting Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          onPress={() => insertFormat("**")}
          style={styles.toolbarButton}
          disabled={!isEditable}
        >
          <Typography variant="bodySemiBold" color={Colors.light.primary}>
            B
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => insertFormat("_")}
          style={styles.toolbarButton}
          disabled={!isEditable}
        >
          <Typography
            variant="body"
            style={{ fontStyle: "italic" }}
            color={Colors.light.primary}
          >
            I
          </Typography>
        </TouchableOpacity>

        {/* Word Count Indicator */}
        <View style={styles.wordCount}>
          <Typography
            variant="caption"
            color={
              wordCount > maxWords
                ? Colors.light.error
                : Colors.light.textSecondary
            }
          >
            {wordCount}/{maxWords} words
          </Typography>
        </View>
      </View>

      {/* Main Editor */}
      <Input
        value={value}
        onChangeText={onChangeText}
        multiline
        placeholder="What's on your mind today?"
        editable={isEditable}
        onSelectionChange={handleSelectionChange}
        style={styles.editorInput}
        containerStyle={styles.inputContainer}
      />

      {/* Dynamic AI Prompt Area */}
      {aiPrompt && (
        <View style={styles.promptContainer}>
          <Typography
            variant="caption"
            color={Colors.light.primary}
            style={styles.promptLabel}
          >
            💡 Thought Starter
          </Typography>
          <Typography variant="bodySmall" style={styles.promptText}>
            {aiPrompt}
          </Typography>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  toolbarButton: {
    marginRight: Spacing.md,
    padding: Spacing.xxs,
  },
  wordCount: {
    marginLeft: "auto",
  },
  inputContainer: {
    marginBottom: Spacing.sm,
  },
  editorInput: {
    minHeight: 200, // Ensure ample writing space
    textAlignVertical: "top",
  },
  promptContainer: {
    backgroundColor: `${Colors.light.primary}10`, // 10% opacity
    padding: Spacing.sm,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.primary,
    marginTop: Spacing.xs,
  },
  promptLabel: {
    fontWeight: "600",
    marginBottom: Spacing.xxs,
  },
  promptText: {
    fontStyle: "italic",
  },
});
