import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Video } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import { db, auth } from "../../FirebaseConfig";
import { ref, get, update } from "firebase/database";

export default function EditRecord() {
  const { id } = useLocalSearchParams(); // Lấy id từ URL
  const [record, setRecord] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    const fetchRecord = async () => {
      try {
        const recordRef = ref(db, `records/${auth.currentUser?.uid}/${id}`);
        const snapshot = await get(recordRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          setRecord(data);
          setTitle(data.title);
          setDescription(data.description);
          setFileUrl(data.fileUrl);
        } else {
          console.log("Record not found");
        }
      } catch (error) {
        console.error("Error fetching record:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const handleSave = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Title and Description are required");
      return;
    }

    const updatedRecord = {
      title,
      description,
      fileUrl,
      date: record.date, // Giữ nguyên ngày đã tạo
      username: record.username, // Giữ nguyên tên người dùng
    };

    try {
      const recordRef = ref(db, `records/${auth.currentUser?.uid}/${id}`);
      await update(recordRef, updatedRecord);
      router.push(`/record-detail/${id}`); // Điều hướng trở lại trang Record Detail
    } catch (error) {
      console.error("Error updating record:", error);
      Alert.alert("Error", "There was an issue updating the record.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!record) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Record not found.</Text>
      </View>
    );
  }

  const extension = fileUrl.split(".").pop()?.toLowerCase().split("?")[0];
  const isImage = extension && (extension === "jpeg" || extension === "jpg" || extension === "png");
  const isVideo = extension && extension === "mp4";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#000"
          onPress={() => router.push('/record')}
        />
        <Text style={styles.title}>Edit Record</Text>
      </View>

      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
      />

      {isImage && (
        <>
          <Text style={styles.label}>Image:</Text>
          <Image source={{ uri: fileUrl }} style={styles.media} resizeMode="contain" />
        </>
      )}

      {isVideo && (
        <>
          <Text style={styles.label}>Video:</Text>
          <Video source={{ uri: fileUrl }} style={styles.media} useNativeControls isLooping />
        </>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginLeft: 10 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
  },
  media: { width: "100%", height: 200, marginTop: 10, borderRadius: 8 },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  errorText: { fontSize: 16, color: "red", textAlign: "center" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
