import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Định nghĩa các bản dịch
const resources = {
    en: {
        translation: {
            "Welcome to React": "Welcome to React",
            "Hello": "Hello, how can I help you?"
        }
    },
    vi: {
        translation: {
            "Welcome to React": "Chào mừng đến với React",
            "Hello": "Xin chào, tôi có thể giúp gì cho bạn?"
        }
    }
};

i18n
    .use(initReactI18next) // Passes i18n down to react-i18next
    .init({
        resources,
        lng: "en", // Ngôn ngữ mặc định
        fallbackLng: "en",

        interpolation: {
            escapeValue: false // React đã escape nội dung mặc định
        }
    });

export default i18n;
