import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  View,
} from "react-native";
import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../FirebaseConfig";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Please check your inbox.");
      router.replace("/sign-in");
    } catch (error: any) {
      switch (error.code) {
        case "auth/invalid-email":
          alert("Invalid email address. Please check and try again.");
          break;
        case "auth/user-not-found":
          alert("No account found with this email address.");
          break;
        default:
          alert("An error occurred. Please try again.");
      }
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
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.description}>
          Enter your email address and we’ll send you a link to reset your
          password.
        </Text>
        <TextInput
          style={styles.textEmail}
          placeholderTextColor="#888"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.text}>Send Reset Link</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/sign-in")}>
          <Text style={styles.textForgotPassword}>Back to Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  ...require("./styles").default,
});
