import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Icon
import { useRouter, useLocalSearchParams } from "expo-router";

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchNewsDetails(id as string);
    }
  }, [id]);

  const fetchNewsDetails = async (newsId: string | undefined) => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${newsId}&apiKey=50a519dff4234f45ae711671927cb913`
      );
      const data = await response.json();
      if (data.articles && data.articles.length > 0) {
        setNews(data.articles[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching news details:", error);
      setLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#5C6BC0" />
      </View>
    );
  }

  if (!news) {
    return (
      <View style={styles.errorContainer}>
        {/* Nút Trở về */}
        <TouchableOpacity style={styles.errorBackButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Thông báo lỗi */}
        <Text style={styles.errorText}>News not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Nút Trở về */}
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Ionicons name="arrow-back" size={24} color="#5C6BC0" />
      </TouchableOpacity>

      {/* Tiêu đề và hình ảnh */}
      {news.urlToImage && (
        <Image source={{ uri: news.urlToImage }} style={styles.image} />
      )}
      <Text style={styles.title}>{news.title}</Text>
      <Text style={styles.content}>{news.content || news.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  // Style cho nút Trở về
  backButton: {
    marginTop: 16,
    marginBottom: 16,
    alignSelf: "flex-start",
    padding: 10,
    backgroundColor: "#E3E8FF",
    borderRadius: 50,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FF6F61",
    marginTop: 16,
    textAlign: "center",
  },
  errorBackButton: {
    position: "absolute",
    top: 40, // Tùy chỉnh khoảng cách từ phía trên
    left: 16,
    backgroundColor: "#5C6BC0",
    padding: 12,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
