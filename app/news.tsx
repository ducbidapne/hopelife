import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { getTrendingNews } from "../api/news";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

export type itemNews = {
  id: string;
  urlToImage: string;
  title: string;
  description: string;
  content: string;
  url: string;
};

export default function NewsScreen() {
  const { theme } = useTheme();
  const [trendingNews, setTrendingNews] = useState<itemNews[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNews, setFilteredNews] = useState<itemNews[]>(trendingNews);
  const [loading, setLoading] = useState(false);

  const fetchNewsSearch = async (search: string | undefined) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${search}&apiKey=50a519dff4234f45ae711671927cb913`
      );
      const data = await response.json();
      if (data.articles && data.articles.length > 0) {
        setFilteredNews(data.articles);
      }
    } catch (error) {
      console.error("Error fetching news details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const news = await getTrendingNews();
      setTrendingNews(news);
      setFilteredNews(news);
    }
    fetchData();
  }, []);

  const handleSearch = () => {
    if (searchQuery) {
      fetchNewsSearch(searchQuery);
    } else {
      setFilteredNews(trendingNews);
    }
  };
  const colors = theme === 'dark' ? ['#333333', '#1A1A1A'] : ['#C9E9D2', '#FEF9F2'];

  return (
    <ScrollView style={{ padding: 16, backgroundColor: "#f7f7f7" }} colors={colors}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="#5C6BC0"
            onPress={() => router.push("/(tabs)")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholderTextColor="#888"
            placeholder="Search news..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : (
        <View style={{ marginTop: 24 }}>
          <Text style={styles.latestText}>Latest</Text>

          {filteredNews.map((item: itemNews, index) => (
            <TouchableOpacity
              key={index}
              style={styles.newsItem}
              onPress={() => router.push(`/newspage/${item.title}`)}
            >
              <Image
                source={{ uri: item.urlToImage }}
                style={styles.newsImage}
              />
              <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>{item.title}</Text>
                <Text numberOfLines={2} style={styles.newsDescription}>
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 16,
  },
  backIcon: {
    marginRight: 20,
  },
  backButton: {
    marginTop: 16,
    marginBottom: 16,
    // padding: 15,
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 18,
    padding: 10,
    color: "#5C6BC0",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  latestText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  newsItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  newsImage: {
    width: 100,
    height: 60,
    borderRadius: 8,
  },
  newsContent: {
    marginLeft: 12,
    flex: 1,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  newsDescription: {
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  searchContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
    flex: 1,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: "#5C6BC0",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
