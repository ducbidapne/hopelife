import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { useLanguage } from "@/language/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const LanguageSetting: React.FC = () => {
    const { language, changeLanguage } = useLanguage();

    const isEnglish = language === "en";

    return (
        <View style={styles.container}>
            <Ionicons
                name="arrow-back"
                size={24}
                color="#4CAF50"
                onPress={() => router.push("/(tabs)/setting")}
                style={styles.backIcon}
            />
            <Text style={styles.text}>Settings</Text>

            <View style={styles.row}>
                <Text style={styles.label}>
                    English
                </Text>
                <Switch
                    value={isEnglish}
                    onValueChange={(value) => changeLanguage(value ? "en" : "vi")}
                />
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>
                    Tiếng Việt
                </Text>
                <Switch
                    value={!isEnglish}
                    onValueChange={(value) => changeLanguage(value ? "vi" : "en")}
                />
            </View>
        </View>
    );
};

export default LanguageSetting;

const styles = StyleSheet.create({
    backIcon: {
        marginBottom: 20,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50,
        backgroundColor: "#FFF",  
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 30,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
    },
});
