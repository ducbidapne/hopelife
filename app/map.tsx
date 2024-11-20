import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface LocationType {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function MapScreen() {
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>({
    latitude: 15.974889,
    longitude: 108.253077,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const locations = [
    {
      id: "1",
      name: "Police Station",
      distance: "2 km",
      type: "police",
      coordinate: {
        latitude: 15.97488,
        longitude: 108.25,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      phone: "113",
    },
    {
      id: "2",
      name: "Hospital",
      distance: "5 km",
      type: "hospital",
      coordinate: {
        latitude: 15.978,
        longitude: 108.25,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      phone: "115",
    },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(location);
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const handlePhoneCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  if (!currentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          router.push("/(tabs)");
        }}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>
      <MapView style={styles.map} initialRegion={currentLocation}>
        <Marker
          key={0}
          coordinate={currentLocation}
          pinColor="red"
          title="You"
          description="Your current location"
        />
      </MapView>

      <View style={styles.infoContainer}>
        <Text style={styles.header}>Nearest Support</Text>
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.infoCard}>
              <Text
                style={[
                  styles.infoText,
                  item?.name === "Hospital"
                    ? { color: "orange" }
                    : { color: "green" },
                ]}
              >
                {item.name} - {item.distance}
              </Text>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handlePhoneCall(item.phone)}>
                  <Text style={styles.actionText}>{item.phone} 📞</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    position: "absolute",
    bottom: 20,
    width: "90%",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  infoText: {
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  actionText: {
    fontSize: 20,
    marginLeft: 10,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#5C6BC0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    zIndex: 1,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
