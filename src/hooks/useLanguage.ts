import { useState, useEffect } from "react";

const LANGUAGE_KEY = "lang";

export function useLanguage(defaultLang: string = "en") {
    const [language, setLanguage] = useState<string>(() => {

        // ✅ Load saved language from localStorage or fallback to default
        return localStorage.getItem(LANGUAGE_KEY) || defaultLang;
    });

    // ✅ Persist language changes to localStorage
    useEffect(() => {
        localStorage.setItem(LANGUAGE_KEY, language);
    }, [language]);

    // ✅ Function to update language
    const changeLanguage = (lang: string) => {
        setLanguage(lang);
    };

    // ✅ Function to clear stored language (optional)
    const clearLanguage = () => {
        localStorage.removeItem(LANGUAGE_KEY);
        setLanguage(defaultLang);
    };

    return { language, changeLanguage, clearLanguage };
}
