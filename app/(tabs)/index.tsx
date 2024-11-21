import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { db, auth } from "../../FirebaseConfig";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
  const { theme } = useTheme();  // Sử dụng theme từ Context
  const colors = theme === 'dark' ? ['#333333', '#1A1A1A'] : ['#C9E9D2', '#FEF9F2'];
  const textColor = theme === 'dark' ? '#FFFFFF' : '#000';
  const cardColor = theme === 'dark' ? '#242424' : '#F8F9FA';
  const iconColor = theme === 'dark' ? '#FFFFFF' : '#789DBC';

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
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: any) => {
    i18n.changeLanguage(language);
  };
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: textColor }]}>{t("How can I help you")}, {username![0]}?</Text>
        <View style={styles.grid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.card, { backgroundColor: cardColor }]}
              onPress={() => handleFeaturePress(feature.name)}
            >
              <Ionicons name={feature.icon} size={50} color={iconColor} />
              <Text style={[styles.cardText, { color: textColor }]}>{feature.name}</Text>
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
  },
});
