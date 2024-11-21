import React, { createContext, useState, useContext, ReactNode } from 'react';
import i18n from './i18n'; 

interface LanguageContextType {
    language: string;
    changeLanguage: (lng: string) => void;
}

const LanguageContext = createContext<LanguageContextType>({
    language: i18n.language,
    changeLanguage: () => {},
});

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguage] = useState<string>(i18n.language);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setLanguage(lng);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
