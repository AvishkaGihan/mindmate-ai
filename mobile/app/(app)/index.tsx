import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useJournalStore } from "../../src/stores/journalStore";

export default function JournalList() {
  const router = useRouter();
  const { journals, fetchJournals, isLoading } = useJournalStore();

  useEffect(() => {
    fetchJournals();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#F5F1ED" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#2C3E50" }}>
          My Journal
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/journal/new")}
          style={{ backgroundColor: "#1BA098", padding: 10, borderRadius: 20 }}
        >
          <Text style={{ color: "white" }}>+ New Entry</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={journals}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchJournals} />
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "white",
              padding: 15,
              borderRadius: 12,
              marginBottom: 10,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 12, color: "#7F8C8D", marginBottom: 5 }}>
              {new Date(item.createdAt).toLocaleDateString()} •{" "}
              {item.mood || "No Mood"}
            </Text>
            <Text numberOfLines={3} style={{ fontSize: 16, color: "#2C3E50" }}>
              {item.content}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text
            style={{ textAlign: "center", marginTop: 50, color: "#7F8C8D" }}
          >
            No entries yet. Start writing!
          </Text>
        }
      />
    </View>
  );
}
