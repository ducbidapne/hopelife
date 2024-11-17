import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { router } from "expo-router";
import { db, auth } from "../FirebaseConfig";
import { ref, query, orderByChild, equalTo, onValue } from "firebase/database";
import { signInWithEmailAndPassword } from "@firebase/auth";

export type ItemRecordType = {
  id?: string;
  username: string;
  date: string;
  title: string;
  description: string;
  fileUrl: string;
};

export default function Record() {
  const [records, setRecords] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<ItemRecordType | null>(
    null
  );

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const recordsRef = ref(db, `records/${auth.currentUser?.uid}`);

    const recordsQuery = query(
      recordsRef,
      orderByChild("username"),
      equalTo(currentUser.email) // Lọc theo email của user hiện tại
    );

    // Lắng nghe thay đổi dữ liệu
    const unsubscribe = onValue(recordsQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...(value as ItemRecordType),
        }));
        setRecords(formattedData);
      } else {
        setRecords([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe(); // Hủy lắng nghe khi component unmount
  }, [currentUser]);

  const handleAddRecord = () => {
    router.push("/add-record");
  };

  const handleRecordPress = (item: ItemRecordType) => {
    // Lưu record đã chọn và mở modal yêu cầu mật khẩu
    setSelectedRecord(item);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setPassword("");
  };

  const handlePasswordSubmit = async () => {
    if (password === "") {
      Alert.alert("Error", "Please enter your password.");
      return;
    }

    // Kiểm tra mật khẩu (đơn giản, chỉ so với mật khẩu hiện tại)
    try {
      const user = auth.currentUser;
      if (user?.email) {
        const check = await signInWithEmailAndPassword(
          auth,
          user?.email,
          password
        );
        if (check) {
          router.push(`/record-detail/${selectedRecord?.id}`);
          setModalVisible(false);
          setPassword("");
        }
      }
    } catch (error) {
      setPassword("");
      Alert.alert("Error", "Incorrect password.");
    }
  };

  const renderRecordItem = ({ item }: { item: ItemRecordType }) => (
    <TouchableOpacity
      style={styles.recordItem}
      onPress={() => handleRecordPress(item)} // Mở modal yêu cầu mật khẩu khi bấm vào item
    >
      <Ionicons name="document-text-outline" size={24} color="#FF4C29" />
      <Text style={styles.recordText}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#000"
          onPress={() => router.push('/(tabs)')}
        />
        <Text style={styles.title}>Record List</Text>
      </View>
      <View style={styles.profile}>
        <Ionicons name="person-circle-outline" size={60} color="#000" />
        <View>
          <Text style={styles.name}>{currentUser?.email}</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>List of Records</Text>
      <FlatList
        data={records}
        renderItem={renderRecordItem}
        keyExtractor={(item) => item.id || ""}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddRecord}>
        <Text style={styles.addButtonText}>Add Record</Text>
      </TouchableOpacity>

      {/* Modal nhập mật khẩu */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Password</Text>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handlePasswordSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#C9E9D2" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginLeft: 10 },
  profile: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  name: { fontSize: 18, fontWeight: "bold" },
  subtitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  recordItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
  },
  recordText: { marginLeft: 10, fontSize: 16, color: "#000" },
  addButton: {
    marginTop: 20,
    backgroundColor: "#8BC34A",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  passwordInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row", // Chắc chắn là các nút nằm ngang
    justifyContent: "space-between", // Giãn cách đều giữa 2 nút
    width: "100%", // Đảm bảo chiều rộng đủ để chứa cả hai nút
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    flex: 1, // Mỗi nút sẽ chiếm một nửa không gian
    marginRight: 10, // Giữa các nút có khoảng cách
  },
  cancelButton: {
    backgroundColor: "#FF4C29",
    padding: 10,
    borderRadius: 8,
    flex: 1, // Mỗi nút sẽ chiếm một nửa không gian
  },
  submitButtonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  cancelButtonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
