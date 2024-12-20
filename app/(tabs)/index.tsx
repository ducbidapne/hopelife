import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { db, auth } from "../../FirebaseConfig";
import { router } from "expo-router";

export default function HomeScreen() {
  const features = [
    { name: "Record", icon: "mic-outline" },
    { name: "Look up", icon: "search-outline" },
    { name: "AI Support", icon: "person-circle-outline" },
    { name: "Messages", icon: "chatbubble-outline" },
    { name: "Quiz", icon: "help-circle-outline" },
    { name: "Map", icon: "map-outline" },
  ];

  const user = auth.currentUser;
  const username = user?.email?.split("@");

  const handleFeaturePress = (feature: string) => {
    switch (feature) {
      case "Map":
        router.push("/map");
        break;
      case "Look up":
        router.push("/news");
        break;
      case "Record":
        router.push("/record");
        break;
      case "Quiz":
        router.push("/quiz");
        break;
      case "AI Support":
        router.push("/ai-support");
        break;
      default:
        alert(`Feature "${feature}" is not implemented yet.`);
        break;
    }
  };

  return (
    <LinearGradient
      colors={["#C9E9D2", "#FEF9F2"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.container}>
        <Text style={styles.title}>How can I help you, {username![0]}?</Text>
        <View style={styles.grid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => handleFeaturePress(feature.name)}
            >
              <Ionicons name={feature.icon} size={50} color="#789DBC" />
              <Text style={styles.cardText}>{feature.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    color: "#000",
    marginBottom: 30,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    height: "47%",
    aspectRatio: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "600",
    color: "#789DBC",
  },
});
