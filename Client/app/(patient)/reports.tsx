import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import { useTheme } from "@/components/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import ReportsScreen from "../reports"; // Importing ReportsScreen

const PatientReports = () => {
  return (
    <ThemedView className="flex-1">
      <ReportsScreen />
    </ThemedView>
  );
};

export default PatientReports;
