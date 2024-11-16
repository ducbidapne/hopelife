import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import { db, auth } from "../../FirebaseConfig";

type EmergencyContact = {
  name: string;
  phone: string;
};

export default function SOSScreen(): JSX.Element {
  const user = auth.currentUser;
  const username = user?.email?.split("@");

  const emergencyContacts: EmergencyContact[] = [
    { name: "My Cousin", phone: "0818741182" },
    { name: "My Dad", phone: "0334339226" },
  ];

  const handleSOSPress = () => {
    alert("Emergency help is on the way!");
  };

  const renderContact = ({ item }: { item: EmergencyContact }): JSX.Element => (
    <View style={styles.contactItem}>
      <Ionicons name="shield-checkmark" size={24} color="#789DBC" />
      <View style={styles.contactTextContainer}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={["#C9E9D2", "#FEF9F2"]}
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
        <Text style={styles.sectionTitle}>Emergency Number</Text>
        <Text style={styles.sectionSubtitle}>List of contacts</Text>

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
    marginBottom: 50,
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
    marginBottom: 50,
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