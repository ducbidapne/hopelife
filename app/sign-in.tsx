import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  View,
} from "react-native";
import React, { useState } from "react";
import { auth } from "../FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) router.replace("/(tabs)");
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed: Email or Password is invalid!");
    }
  };
  const handleSignUp = async () => {
    router.replace("/sign-up");
  };

  return (
    <LinearGradient
      colors={["#C9E9D2", "#FEF9F2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Hello!</Text>
        <Text style={styles.appName}>Sign In</Text>
        <Image
          source={require("@/assets/images/logo_hopeline.jpg")}
          style={styles.appLogo}
        />
        <TextInput
          style={styles.textEmail}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.textPassword}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.textForgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.text}>Sign In</Text>
        </TouchableOpacity>
        <View  style={styles.signUpContainer}>
          <Text>Don’t have an account?</Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.textSignUp}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  ...require("./styles").default,
});
