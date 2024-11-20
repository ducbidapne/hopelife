import React, { useState } from "react";
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

export type RecordFileType = {
  name: string;
  uri: string;
  type?: string; // MIME type
  size?: number; // File size in bytes
};

export default function AddRecord() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<RecordFileType | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = auth.currentUser;

  const handleSave = async () => {
    if (!title || !description || !file) {
      Alert.alert("Error", "Please fill in all fields and select a file.");
      return;
    }

    try {
      setIsLoading(true);

      // Upload file lên Firebase Storage
      const fileBlob = await fetch(file.uri).then((res) => res.blob());
      const fileRef = ref(
        storage,
        `records/${currentUser?.uid || "unknown-user"}/${Date.now()}_${
          file.name
        }`
      );
      await uploadBytes(fileRef, fileBlob);

      // Lấy URL của file
      const fileUrl = await getDownloadURL(fileRef);
      console.log("File URL:", fileUrl);

      // Chuẩn bị dữ liệu lưu vào Database
      const recordData = {
        username: currentUser?.email || "Anonymous",
        date: date.toISOString(),
        title,
        description,
        fileUrl,
      };
      console.log("Record Data to Save:", recordData);

      // Lưu vào Database
      const recordRef = dbRef(db, `records/${currentUser?.uid || "test-user"}`);
      const newRecordRef = push(recordRef);
      await set(newRecordRef, recordData);

      setIsLoading(false);
      Alert.alert("Success", "Record saved successfully!");
      router.push("/record");
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", "Failed to save record. Please try again.");
      console.error("Database Save Error:", error);
    }
  };

  const handleFilePick = async () => {
    try {
      const result: any = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "video/mp4", "video/quicktime"],
        copyToCacheDirectory: true,
      });

      // Kiểm tra nếu người dùng hủy chọn file
      if (result.canceled) {
        console.log("File selection was canceled.");
        Alert.alert(
          "No file selected",
          "You have canceled the file selection."
        );
        return;
      }

      // Kiểm tra nếu assets tồn tại
      if (result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];

        // Kiểm tra nếu `name` tồn tại
        const fileName = selectedFile.name || "Unnamed File";

        // Kiểm tra phần mở rộng file
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
          Alert.alert(
            "Invalid File",
            "Please select a file with the extensions .jpeg, .png, .jpg, .mp4 or .mov"
          );
        }
      } else {
        console.log("No assets found in result.");
        Alert.alert("Error", "No file selected or invalid file.");
      }
    } catch (error) {
      console.error("Error picking file: ", error);
      Alert.alert("Error", "An error occurred while picking the file.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#000"
          onPress={() => router.back()}
        />
        <Text style={styles.title}>Add New Record</Text>
      </View>
      <Text style={styles.label}>Select Date</Text>
      <TouchableOpacity
        style={styles.datePicker}
        onPress={() => setShowDatePicker(true)}
      >
        <Ionicons name="calendar-outline" size={24} color="#000" />
        <Text style={styles.dateText}>
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
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter description"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={styles.label}>Uploaded File</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={handleFilePick}>
        <Ionicons name="attach-outline" size={24} color="#000" />
        <Text style={styles.uploadText}>
          {file ? file.name : "Select File"}
        </Text>
      </TouchableOpacity>
      {isLoading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#C9E9D2" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginLeft: 10 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 20 },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  dateText: { marginLeft: 10, fontSize: 16 },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  uploadText: { marginLeft: 10, fontSize: 16 },
  saveButton: {
    marginTop: 30,
    backgroundColor: "#8BC34A",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
});
