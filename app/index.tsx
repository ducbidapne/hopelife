import React from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const Index = () => {
  return (
    <LinearGradient
      colors={["#C9E9D2", "#FEF9F2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.appName}>HOPELINE</Text>
        <Image
          source={require("@/assets/images/logo_hopeline.jpg")}
          style={styles.appLogo}
        />

        <TouchableOpacity
          style={styles.buttonSignIn}
          onPress={() => router.push("/sign-in")}
        >
          <Text style={styles.text}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSignUp}
          onPress={() => router.push("/sign-up")}
        >
          <Text style={styles.textSignUp}>Sign Up</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "400",
    marginBottom: 10,
    color: "#5C6BC0",
  },
  appName: {
    fontSize: 40,
    fontWeight: "700",
    marginBottom: 50,
    color: "#5C6BC0",
  },
  appLogo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 50,
  },
  buttonSignIn: {
    height: 50,
    width: 350,
    marginVertical: 15,
    backgroundColor: "#789DBC",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5C6BC0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonSignUp: {
    height: 50,
    width: 350,
    marginVertical: 15,
    backgroundColor: "#C6D6E4",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5C6BC0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  textSignUp: {
    color: "#2B2B2B",
    fontSize: 18,
    fontWeight: "600",
  },
});
