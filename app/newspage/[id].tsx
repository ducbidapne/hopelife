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
import { useRouter, useLocalSearchParams } from "expo-router";

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Hook để điều hướng

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
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!news) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>News not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Nút Trở về */}
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>{"< Back"}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{id}</Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  image: {
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  // Style cho nút trở về
  backButton: {
    marginTop: 16,
    marginBottom: 16,
    padding: 8,
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5C6BC0",
  },
});
