import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { db, storage, auth } from "../FirebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { set, ref as dbRef, push } from "firebase/database";
import { useTheme } from "../contexts/ThemeContext";

export default function AddRecord() {
  const { theme } = useTheme();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = auth.currentUser;

  const textColor = theme === 'dark' ? '#FFFFFF' : '#000';
  const backgroundColor = theme === 'dark' ? '#333' : '#C9E9D2';
  const inputColor = theme === 'dark' ? '#555' : '#FFF';
  const buttonColor = theme === 'dark' ? '#666' : '#8BC34A';
  const buttonTextColor = theme === 'dark' ? '#FFFFFF' : '#fff';

  useEffect(() => {
    const getAvatar = async () => {
      if (auth.currentUser) {
        const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
        try {
          const url = await getDownloadURL(storageRef);
          setImage(url);
        } catch (error) {
          console.log('Unable to retrieve image', error);
        }
      }
    };
    getAvatar();
  }, []);

  const handleSave = async () => {
    if (!title || !description || !file) {
      Alert.alert("Error", "Please fill in all fields and select a file.");
      return;
    }

    setIsLoading(true);
    try {
      const fileBlob = await fetch(file.uri).then(res => res.blob());
      const fileRef = ref(storage, `records/${currentUser?.uid || "unknown-user"}/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, fileBlob);
      const fileUrl = await getDownloadURL(fileRef);
      const recordData = {
        username: currentUser?.email || "Anonymous",
        date: date.toISOString(),
        title,
        description,
        fileUrl,
      };

      const recordRef = dbRef(db, `records/${currentUser?.uid || "test-user"}`);
      const newRecordRef = push(recordRef);
      await set(newRecordRef, recordData);

      setIsLoading(false);
      Alert.alert("Success", "Record saved successfully!");
      router.push("/record");
    } catch (error) {
      setIsLoading(false);
      console.error("Database Save Error:", error);
      Alert.alert("Error", "Failed to save record. Please try again.");
    }
  };

  const handleFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "video/mp4", "video/quicktime"],
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      Alert.alert("No file selected", "You have canceled the file selection.");
      return;
    }

    if (result.assets && result.assets.length > 0) {
      const selectedFile = result.assets[0];
      const fileName = selectedFile.name || "Unnamed File";
      const validExtensions = ["jpeg", "png", "jpg", "mp4", "mov"];
      const fileExtension = fileName.split(".").pop()?.toLowerCase();

      if (fileExtension && validExtensions.includes(fileExtension)) {
        setFile({
          name: fileName,
          uri: selectedFile.uri,
          type: selectedFile.mimeType || "unknown",
          size: selectedFile.size || 0,
        });
      } else {
        Alert.alert("Invalid File", "Please select a file with the extensions .jpeg, .png, .jpg, .mp4 or .mov");
      }
    } else {
      Alert.alert("Error", "No file selected or invalid file.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={textColor}
          onPress={() => router.back()}
        />
        <Text style={[styles.title, { color: textColor }]}>Add New Record</Text>
      </View>
      <Text style={[styles.label, { color: textColor }]}>Select Date</Text>
      <TouchableOpacity
        style={[styles.datePicker, { backgroundColor: inputColor }]}
        onPress={() => setShowDatePicker(true)}
      >
        <Ionicons name="calendar-outline" size={24} color={textColor} />
        <Text style={[styles.dateText, { color: textColor }]}>
          {date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}
      <Text style={[styles.label, { color: textColor }]}>Title</Text>
      <TextInput
        style={[styles.input, { backgroundColor: inputColor }]}
        placeholder="Enter title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={[styles.label, { color: textColor }]}>Description</Text>
      <TextInput
        style={[styles.input, { backgroundColor: inputColor }]}
        placeholder="Enter description"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={[styles.label, { color: textColor }]}>Uploaded File</Text>
      <TouchableOpacity
        style={[styles.uploadButton, { backgroundColor: inputColor }]}
        onPress={handleFilePick}
      >
        <Ionicons name="attach-outline" size={24} color={textColor} />
        <Text style={[styles.uploadText, { color: textColor }]}>
          {file ? file.name : "Select File"}
        </Text>
      </TouchableOpacity>
      {isLoading ? (
        <ActivityIndicator size="large" color={textColor} />
      ) : (
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: buttonColor }]}
          onPress={handleSave}
        >
          <Text style={[styles.saveButtonText, { color: buttonTextColor }]}>Save</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginLeft: 10 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 20 },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  dateText: { marginLeft: 10, fontSize: 16 },
  input: {
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  uploadText: { marginLeft: 10, fontSize: 16 },
  saveButton: {
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: { fontSize: 16, fontWeight: "bold" },
});
