import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { db, auth } from "../../FirebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { launchImageLibraryAsync } from "expo-image-picker";
import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { storage } from "../../FirebaseConfig";

export default function SettingsScreen() {
  const [image, setImage] = useState<string | null>(null);

  // Load image from Firebase Storage
  useEffect(() => {
    const getAvatar = async () => {
      const storageRef = ref(storage, `avatars/${auth.currentUser?.uid}`);
      const url = await storageRef.fullPath;
      // Get full url of the image
      try {
        const url = await getDownloadURL(storageRef);
        setImage(url);
      } catch (error) {
        console.log('Unable to retrieve image', error);
      }
    };
    getAvatar();
  }, []);

  const settingsOptions = [
    { title: "Account", icon: "person-outline" },
    { title: "Notification", icon: "notifications-outline" },
    { title: "Light/Dark", icon: "moon-outline" },
    { title: "Privacy & Security", icon: "shield-checkmark-outline" },
    { title: "Language", icon: "globe-outline" },
    { title: "Logout", icon: "log-out" },
  ];

  const user = auth.currentUser;
  const username = user?.email?.split("@");

  const handleChangePassword = () => {
    router.push("/change-password");
  }

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await auth.signOut();
              router.push("/sign-in");
            } catch (error) {
              Alert.alert("Error!");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  const pickImage = async () => {
    let result = await launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // Save to Firebase Storage
      const storageRef = ref(storage, `avatars/${user?.uid}`);
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      Alert.alert("Success", "Change avatar successfully!");
      if (user) {
        await updateProfile(user, {
          photoURL: `avatars/${user.uid}`,
        });
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
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.header}>Settings</Text>

        {/* Profile Section */}
        <View style={styles.profileContainer}>
          <View style={styles.avatar}>
            <Image
              source={{ uri: image || user?.photoURL || undefined }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <TouchableOpacity style={styles.editIcon}>
              <Ionicons name="create-outline" size={20} color="#fff" onPress={pickImage}/>
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{username![0]}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>

        {/* Settings Options */}
        <FlatList
          data={settingsOptions}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                if (item.title === "Logout") {
                  handleLogout();
                } else if (item.title === "Privacy & Security") {
                  handleChangePassword();
                } else {
                  Alert.alert(
                    "Info",
                    `${item.title} option is not implemented yet.`
                  );
                }
              }}
            >
              <View style={styles.optionLeft}>
                <Ionicons name={item.icon} size={24} color="#789DBC" />
                <Text style={styles.optionText}>{item.title}</Text>
              </View>
              <Ionicons
                name="chevron-forward-outline"
                size={24}
                color="#789DBC"
              />
            </TouchableOpacity>
          )}
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
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#4A6FA5",
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    position: "relative",
  },
  editIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#789DBC",
    borderRadius: 20,
    padding: 5,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4A6FA5",
    marginTop: 10,
  },
  profileEmail: {
    fontSize: 14,
    color: "#789DBC",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#4A6FA5",
    marginLeft: 10,
  },
});
