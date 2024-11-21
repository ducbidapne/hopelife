import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Định nghĩa kiểu dữ liệu cho context
interface ThemeContextType {
    theme: ColorSchemeName;
    toggleTheme: () => void;
    setTheme: (theme: ColorSchemeName) => void; // Hàm thay đổi trực tiếp
}

// Khởi tạo context với giá trị mặc định
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setThemeState] = useState<ColorSchemeName>("light");

    // Lấy trạng thái từ AsyncStorage khi khởi động
    useEffect(() => {
        const loadTheme = async () => {
            const storedTheme = await AsyncStorage.getItem("theme");
            if (storedTheme) {
                setThemeState(storedTheme as ColorSchemeName);
            } else {
                setThemeState(Appearance.getColorScheme() || "light");
            }
        };
        loadTheme();
    }, []);

    // Lưu trạng thái vào AsyncStorage khi thay đổi
    const setTheme = async (newTheme: ColorSchemeName) => {
        setThemeState(newTheme);
        if (newTheme) {
            await AsyncStorage.setItem("theme", newTheme);
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook để sử dụng ThemeContext
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
