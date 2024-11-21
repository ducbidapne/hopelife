import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  View,
} from "react-native";
import { auth } from "../FirebaseConfig";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext"; // Thêm dòng này

const ChangePasswordScreen = () => {
  const { theme } = useTheme(); // Lấy theme từ Context
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    try {
      if (auth.currentUser && auth.currentUser.email) {
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email,
          currentPassword
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
      } else {
        throw new Error("User is not authenticated");
      }

      await updatePassword(auth.currentUser, newPassword);
      Alert.alert(
        "Success",
        "Password has been updated successfully! Please sign in again."
      );
      auth.signOut();
      router.replace("/sign-in");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", "Failed to update password. Please try again.");
    }
  };

  const colors = theme === 'dark' ? ['#333333', '#1A1A1A'] : ['#C9E9D2', '#FEF9F2'];
  const textColor = theme === 'dark' ? '#FFFFFF' : '#4A6FA5';
  const inputBackgroundColor = theme === 'dark' ? '#666' : '#fff';
  const inputBorderColor = theme === 'dark' ? '#888' : '#ccc';
  const buttonColor = theme === 'dark' ? '#666' : '#4A6FA5';
  const buttonText = theme === 'dark' ? '#FFFFFF' : '#ffffff';

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Ionicons
        name="arrow-back"
        size={24}
        color={textColor}
        onPress={() => router.push("/(tabs)/setting")}
        style={styles.backIcon}
      />
      <SafeAreaView style={styles.container}>
        <Text style={[styles.title, { color: textColor }]}>Change Password</Text>
        <TextInput
          style={[styles.input, { backgroundColor: inputBackgroundColor, borderColor: inputBorderColor }]}
          placeholderTextColor="#888"
          placeholder="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
        />
        <TextInput
          style={[styles.input, { backgroundColor: inputBackgroundColor, borderColor: inputBorderColor }]}
          placeholder="New Password"
          placeholderTextColor="#888"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <TextInput
          style={[styles.input, { backgroundColor: inputBackgroundColor, borderColor: inputBorderColor }]}
          placeholder="Confirm New Password"
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TouchableOpacity style={[styles.button, { backgroundColor: buttonColor }]} onPress={handleUpdatePassword}>
          <Text style={[styles.buttonText, { color: buttonText }]}>Update Password</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backIcon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 50,
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
