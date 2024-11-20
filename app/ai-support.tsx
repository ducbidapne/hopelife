import React, { useState, useEffect } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as Speech from "expo-speech";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { router } from "expo-router";

type Message = {
  text: string;
  user: boolean;
};

const GeminiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showStopIcon, setShowStopIcon] = useState<boolean>(false);
  const API_KEY: string = "AIzaSyBK8vJKhq6Jo-RgZVdPNX16KxIt-BB7GFs";

  useEffect(() => {
    const startChat = async () => {
      try {
        const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = "hello!";
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        setMessages([{ text, user: false }]);
      } catch (error) {
        console.error("Error starting chat:", error);
      }
    };

    startChat();
  }, []);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    setLoading(true);

    const userMessage: Message = { text: userInput, user: true };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = userMessage.text;
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      setMessages((prev) => [...prev, { text, user: false }]);
      if (text && !isSpeaking) {
        Speech.speak(text);
        setIsSpeaking(true);
        setShowStopIcon(true);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
      setUserInput("");
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && !lastMessage.user) {
        Speech.speak(lastMessage.text);
        setIsSpeaking(true);
      }
    }
  };

  const ClearMessage = () => {
    setMessages([]);
    setIsSpeaking(false);
    setShowStopIcon(false);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.user ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Text style={[styles.messageText]}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20} // Điều chỉnh khoảng cách giữa TextInput và bàn phím
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              router.push("/(tabs)");
            }}
          >
            <Entypo name="chevron-left" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>AI Support</Text>
        </View>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.micIcon} onPress={toggleSpeech}>
            {isSpeaking ? (
              <FontAwesome
                name="microphone-slash"
                size={24}
                color="white"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            ) : (
              <FontAwesome
                name="microphone"
                size={24}
                color="white"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            )}
          </TouchableOpacity>
          <TextInput
            placeholder="Type a message"
            placeholderTextColor="black"
            onChangeText={setUserInput}
            value={userInput}
            onSubmitEditing={sendMessage}
            style={styles.input}
          />
          {showStopIcon && (
            <TouchableOpacity style={styles.stopIcon} onPress={ClearMessage}>
              <Entypo name="controller-stop" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingTop: 30,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#789DBC",
    paddingVertical: 15,
  },
  backButton: {
    position: "absolute",
    left: 10,
    marginTop: 20,
    top: "50%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    maxWidth: "75%",
    borderRadius: 16,
  },
  messageText: { fontSize: 16 },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#C9E9D2",
    color: "#000",
    borderTopRightRadius: 0,
    borderRadius: 16,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#F3F6F6",
    color: "#000",
    borderTopLeftRadius: 0,
    borderRadius: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F3F6F6",
    borderRadius: 10,
    height: 50,
    color: "black",
  },
  micIcon: {
    padding: 10,
    backgroundColor: "#C9E9D2",
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  stopIcon: {
    padding: 10,
    backgroundColor: "#C9E9D2",
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 3,
  },
});

export default GeminiChat;
