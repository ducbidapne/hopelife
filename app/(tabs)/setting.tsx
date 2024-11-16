import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { db, auth } from "../../FirebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";


export default function SettingsScreen() {
  const settingsOptions = [
    { title: "Account", icon: "person-outline" },
    { title: "Notification", icon: "notifications-outline" },
    { title: "Light/Dark", icon: "moon-outline" },
    { title: "Privacy & Security", icon: "shield-checkmark-outline" },
    { title: "Language", icon: "globe-outline" },
    { title: "Logout", icon: "log-out" },
  ];

  const user = auth.currentUser;
  const username = user?.email?.split("@");

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await auth.signOut();
              router.push("/sign-in");
            } catch (error) {
              Alert.alert("Error!");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <LinearGradient
      colors={["#C9E9D2", "#FEF9F2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.header}>Settings</Text>

        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person-circle" size={100} color="#789DBC" />
            <TouchableOpacity style={styles.editIcon}>
              <Ionicons name="create-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{username![0]}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>

        {/* Settings Options */}
        <FlatList
          data={settingsOptions}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                if (item.title === "Logout") {
                  handleLogout();
                } else {
                  Alert.alert(
                    "Info",
                    `${item.title} option is not implemented yet.`
                  );
                }
              }}
            >
              <View style={styles.optionLeft}>
                <Ionicons name={item.icon} size={24} color="#789DBC" />
                <Text style={styles.optionText}>{item.title}</Text>
              </View>
              <Ionicons
                name="chevron-forward-outline"
                size={24}
                color="#789DBC"
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#4A6FA5",
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    position: "relative",
  },
  editIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#789DBC",
    borderRadius: 20,
    padding: 5,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4A6FA5",
    marginTop: 10,
  },
  profileEmail: {
    fontSize: 14,
    color: "#789DBC",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#4A6FA5",
    marginLeft: 10,
  },
});
