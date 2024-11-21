import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { db, auth } from "@/FirebaseConfig";
import { useTheme } from "@/contexts/ThemeContext";

type EmergencyContact = {
  name: string;
  phone: string;
};

export default function SOSScreen(): JSX.Element {
  const { theme } = useTheme(); 
  const user = auth.currentUser;
  const username = user?.email?.split("@");

  // Danh sách số khẩn cấp ở Việt Nam
  const emergencyContacts: EmergencyContact[] = [
    { name: "Police", phone: "113" },
    { name: "Fire Department", phone: "114" },
    { name: "Ambulance", phone: "115" },
    { name: "Traffic Police", phone: "1022" },
    { name: "Traffic Accident Assistance", phone: "1040" },
  ];

  const handleSOSPress = () => {
    const phoneUrl = "tel:111"; // Đặt số điện thoại cần gọi
    Linking.openURL(phoneUrl).catch((err) =>
      console.error("Failed to open dialer", err)
    );
  };

  const handleCallPress = (phone: string) => {
    // Mở ứng dụng gọi điện thoại với số đã chọn
    const phoneUrl = `tel:${phone}`;
    Linking.openURL(phoneUrl).catch((err) =>
      console.error("Failed to open dialer", err)
    );
  };

  const renderContact = ({ item }: { item: EmergencyContact }): JSX.Element => (
    <TouchableOpacity onPress={() => handleCallPress(item.phone)}>
      <View style={styles.contactItem}>
        <Ionicons name="shield-checkmark" size={24} color="#789DBC" />
        <View style={styles.contactTextContainer}>
          <Text style={styles.contactName}>{item.name}</Text>

          <Text style={styles.contactPhone}>{item.phone}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={theme === 'dark' ? ['#333333', '#1A1A1A'] : ['#C9E9D2', '#FEF9F2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.greeting}>Hi, {username![0]} !</Text>
        <Text style={styles.question}>Are you in emergency?</Text>
        <Text style={styles.description}>
          Press the button below help will reach you soon.
        </Text>

        {/* SOS Button */}
        <TouchableOpacity style={styles.sosButton} onPress={handleSOSPress}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>

        {/* Emergency Contacts */}
        <Text style={styles.sectionTitle}>Emergency Numbers</Text>
        <Text style={styles.sectionSubtitle}>List of emergency contacts</Text>

        <FlatList
          data={emergencyContacts}
          keyExtractor={(item) => item.phone}
          renderItem={renderContact}
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
  greeting: {
    fontSize: 26,
    fontWeight: "600",
    color: "#4A6FA5",
    marginBottom: 5,
  },
  question: {
    fontSize: 24,
    fontWeight: "400",
    color: "#4A6FA5",
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: "#789DBC",
    marginBottom: 20,
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#E74C3C",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 20,
    borderWidth: 18, 
    borderColor: "#F19483", 
  },
  sosText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A6FA5",
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#789DBC",
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  contactTextContainer: {
    marginLeft: 10,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A6FA5",
  },
  contactPhone: {
    fontSize: 14,
    color: "#789DBC",
  },
});
