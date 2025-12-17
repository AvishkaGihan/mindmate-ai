import React from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
// import { useChatStore } from '../../stores/chatStore';

/**
 * Main Tab Navigation Layout
 * Configures the 5 core sections of the application.
 * Handles tab styling, icons, and badges.
 */

export default function TabLayout() {
  // Access store for chat badge logic
  // In a real app, we'd track 'unreadCount' specifically.
  // For MVP, we'll keep it simple or strictly follow the store structure we have.
  // const messages = useChatStore((state) => state.messages);
  // but the structure is here to enable it: `tabBarBadge: unreadCount > 0 ? unreadCount : undefined`
  const unreadCount = undefined;

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Screens manage their own headers (or have none)
        tabBarActiveTintColor: Colors.light.primary, // Teal
        tabBarInactiveTintColor: Colors.light.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.light.background,
          borderTopColor: "#E0E0E0",
          borderTopWidth: 1,
          height: Platform.OS === "android" ? 60 : 90,
          paddingBottom: Platform.OS === "android" ? 10 : 30,
          paddingTop: 10,
          elevation: 8, // Shadow for Android
          shadowColor: "#000", // Shadow for iOS
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          fontFamily: Platform.select({ ios: "System", android: "Roboto" }),
        },
        tabBarHideOnKeyboard: true, // Prevents tab bar from riding up on Android keyboard
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarLabel: "Chat",
          tabBarBadge: unreadCount,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "chatbubbles" : "chatbubbles-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="breathe"
        options={{
          title: "Breathe",
          tabBarLabel: "Breathe",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "leaf" : "leaf-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
          tabBarLabel: "Insights",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "bar-chart" : "bar-chart-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
