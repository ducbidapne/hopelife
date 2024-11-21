import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { lightTheme, darkTheme } from "@/contexts/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";


const SettingsScreen: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const currentTheme = theme === "light" ? lightTheme : darkTheme;

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <Ionicons
                name="arrow-back"
                size={24}
                color="#4CAF50"
                onPress={() => router.push("/(tabs)/setting")}
                style={styles.backIcon}
            />
            <Text style={[styles.text, { color: currentTheme.text }]}>Settings</Text>

            <View style={styles.row}>
                <Text style={[styles.label, { color: currentTheme.text }]}>
                    Enable Dark Mode
                </Text>
                <Switch
                    value={theme === "dark"}
                    onValueChange={(value) => setTheme(value ? "dark" : "light")}
                />
            </View>
        </View>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    backIcon: {
        marginBottom: 20,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50,
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