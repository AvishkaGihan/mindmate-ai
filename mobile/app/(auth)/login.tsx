import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useAuthStore } from "../../src/stores/authStore";
import { useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const { login } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (e) {
      Alert.alert("Login Failed", (e as Error).message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: "bold" }}>
        MindMate Login
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          padding: 15,
          borderRadius: 10,
          marginBottom: 10,
        }}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPass}
        secureTextEntry
        style={{
          borderWidth: 1,
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
        }}
      />
      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#1BA098",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("signup" as any)}
        style={{ marginTop: 20, alignItems: "center" }}
      >
        <Text style={{ color: "#1BA098" }}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}
