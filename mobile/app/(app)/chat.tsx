import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useRef } from "react";
import { useChatStore, ChatMessage } from "../../src/stores/chatStore";

export default function ChatScreen() {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChatStore();
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";
    return (
      <View
        style={{
          alignSelf: isUser ? "flex-end" : "flex-start",
          backgroundColor: isUser ? "#1BA098" : "white", // Teal accent vs White neutral
          padding: 12,
          borderRadius: 12,
          marginVertical: 4,
          maxWidth: "80%",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 1,
        }}
      >
        <Text style={{ color: isUser ? "white" : "#2C3E50", fontSize: 16 }}>
          {item.content}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#F5F1ED" }}
    >
      <View
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#E0E0E0",
          backgroundColor: "white",
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#2C3E50" }}>
          MindMate AI
        </Text>
        <Text style={{ fontSize: 12, color: "#7F8C8D" }}>
          Supportive Companion
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View
        style={{ flexDirection: "row", padding: 16, backgroundColor: "white" }}
      >
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Talk to MindMate..."
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 20,
            paddingHorizontal: 16,
            height: 44,
            marginRight: 8,
          }}
        />
        <TouchableOpacity
          onPress={handleSend}
          style={{
            backgroundColor: "#1BA098",
            borderRadius: 20,
            width: 44,
            height: 44,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
