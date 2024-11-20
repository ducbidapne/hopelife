import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { auth } from "../FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

// Hàm validate đầu vào
const validateInputs = (
  email: string,
  password: string,
  confirmPassword: string
) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return false;
  }
  if (!password || password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return false;
  }
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return false;
  }
  return true;
};

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    if (validateInputs(email, password, confirmPassword)) {
      try {
        const user = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (user) router.replace("/(tabs)");
      } catch (error: any) {
        console.log(error);
        alert("Sign up failed: " + error.message);
      }
    }
  };

  const handleSignIn = async () => {
    router.replace("/sign-in");
  };

  return (
    <LinearGradient
      colors={["#C9E9D2", "#FEF9F2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Hello!</Text>
          <Text style={styles.appName}>Sign Up</Text>
          <Image
            source={require("@/assets/images/logo_hopeline.jpg")}
            style={styles.appLogo}
          />
          <TextInput
            style={styles.textEmail}
            placeholderTextColor="#888"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.textPassword}
            placeholderTextColor="#888"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.textPassword}
            placeholder="Re-enter Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.text}>Sign Up</Text>
          </TouchableOpacity>
          <View style={styles.signUpContainer}>
            <Text>Already have an account?</Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text style={styles.textSignUp}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  ...require("./styles").default,
});
