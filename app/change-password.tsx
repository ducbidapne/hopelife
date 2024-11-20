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

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    try {
      // Reauthenticate user
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
      // Clear session
      auth.signOut();
      router.replace("/sign-in");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", "Failed to update password. Please try again.");
    }
  };

  return (
    <LinearGradient
      colors={["#C9E9D2", "#FEF9F2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Change Password</Text>

        <TextInput
          style={styles.input}
          placeholderTextColor="#888"
          placeholder="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#888"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
          <Text style={styles.buttonText}>Update Password</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A6FA5",
    marginBottom: 20,
  },
  input: {
    height: 50,
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#4A6FA5",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
