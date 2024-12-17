import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/components/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

const RecordingsLayout = ({ children }: { children: React.ReactNode }) => {
  const { theme: currentTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentTheme === "light" ? "#fff" : "#333" },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentTheme === "light" ? "#000" : "#fff" }]}>
          {t.information.recordings}
        </Text>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#007BFF",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default RecordingsLayout;
