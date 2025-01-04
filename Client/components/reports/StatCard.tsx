import React from "react";
import { View } from "react-native";
import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";
import { Feather } from "@expo/vector-icons";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/components/ThemeContext";
import { theme } from "@/styles/Theme";

interface StatCardProps {
  title: string;
  value: string;
  icon: keyof typeof Feather.glyphMap;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  const { t, isRTL, getGenderedText } = useLanguage();
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  return (
    <ThemedView
      className="p-2 rounded-lg w-[49%] mb-4 shadow-md"
      variant="surface"
    >
      <ThemedView
        className={`flex-row items-center mb-3 ${
          isRTL ? "flex-row-reverse" : "flex-row"
        }`}
        variant="surface"
      >
        <ThemedView
          className="p-2 rounded-full flex-shrink-0"
          variant="surface"
        >
          <Feather name={icon} size={20} color="#3b82f6" />
        </ThemedView>

        <ThemedView
          className={`${isRTL ? "mr-4" : "ml-4"} flex-1`}
          variant="surface"
        >
          <ThemedText
            className="font-pbold text-lg mb-0.5"
            numberOfLines={3}
            adjustsFontSizeToFit
            isRTL={isRTL}
          >
            {value}
          </ThemedText>
          <ThemedText
            className="font-pmedium text-xs mb-0.5"
            numberOfLines={3}
            isRTL={isRTL}
          >
            {title}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

export default StatCard;
