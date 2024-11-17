import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Video } from "expo-av"; // Dùng để hiển thị video
import { router, useLocalSearchParams } from "expo-router";
import { db, auth } from "../../FirebaseConfig";
import { ref as databaseRef, get, remove } from "firebase/database";
import { getStorage, ref as storageRef, deleteObject } from "firebase/storage";
export default function RecordDetail() {
  const { id } = useLocalSearchParams(); // Lấy id từ URL
  const [record, setRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchRecord = async () => {
      try {
        const recordRef = databaseRef(
          db,
          `records/${auth.currentUser?.uid}/${id}`
        );
        const snapshot = await get(recordRef);

        if (snapshot.exists()) {
          setRecord(snapshot.val());
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

  const handleDelete = async () => {
    // Xác nhận người dùng có chắc chắn muốn xóa không
    Alert.alert("Confirm", "Are you sure you want to delete this record?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            // Lấy đường dẫn đến file trong Firebase Storage
            const storage = getStorage();
            const fileRef = storageRef(storage, record.fileUrl); // Sử dụng 'storageRef' thay cho 'ref'

            // Xóa file từ Firebase Storage
            await deleteObject(fileRef);
            console.log("File deleted successfully");

            // Xóa bản ghi khỏi Firebase Realtime Database
            const recordRef = databaseRef(
              db,
              `records/${auth.currentUser?.uid}/${id}`
            );
            await remove(recordRef); // Xóa bản ghi khỏi Firebase
            router.back(); // Quay lại trang trước khi xóa
          } catch (error) {
            console.error("Error deleting record:", error);
          }
        },
      },
    ]);
  };
  const extension = record?.fileUrl
    .split(".")
    .pop()
    ?.toLowerCase()
    .split("?")[0];

  const isImage =
    extension &&
    (extension === "jpeg" || extension === "jpg" || extension === "png");

  const isVideo = extension && extension === "mp4";

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#000"
          onPress={() => router.back()}
        />
        <Text style={styles.title}>Record Detail</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.label}>Title:</Text>
        <Text style={styles.value}>{record.title}</Text>

        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>
          {new Date(record.date).toLocaleDateString()}
        </Text>

        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{record.description}</Text>

        {isImage && (
          <>
            <Text style={styles.label}>Image:</Text>
            <Image
              source={{ uri: record.fileUrl }}
              style={styles.media}
              resizeMode="contain"
            />
          </>
        )}

        {isVideo && (
          <>
            <Text style={styles.label}>Video:</Text>
            <Video
              source={{ uri: record.fileUrl }}
              style={styles.media}
              useNativeControls
              isLooping
            />
          </>
        )}
      </View>

      {/* Thêm các nút Edit và Delete */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push(`/record-edit/${id}`)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginLeft: 10 },
  detailContainer: { marginTop: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  value: { fontSize: 16, marginBottom: 15, color: "#333" },
  media: { width: "100%", height: 200, marginTop: 10, borderRadius: 8 },
  errorText: { fontSize: 16, color: "red", textAlign: "center" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Các nút Edit và Delete
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#FF4C29",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
