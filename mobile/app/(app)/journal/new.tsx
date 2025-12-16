import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useJournalStore } from "../../../src/stores/journalStore";

export default function NewJournal() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("Peaceful"); // Default for MVP
  const { createJournal, isLoading } = useJournalStore();
  const router = useRouter();

  const handleSave = async () => {
    if (!text.trim()) return;
    try {
      await createJournal(text, mood);
      router.back();
    } catch (e) {
      alert("Failed to save journal");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 16, color: "#7F8C8D" }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#1BA098" />
          ) : (
            <Text
              style={{ fontSize: 16, color: "#1BA098", fontWeight: "bold" }}
            >
              Save
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <TextInput
        multiline
        placeholder="What's on your mind?"
        style={{ flex: 1, fontSize: 18, textAlignVertical: "top" }}
        value={text}
        onChangeText={setText}
        autoFocus
      />
    </View>
  );
}
