import React, { useState, useEffect } from "react";
import { View, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import { userService } from "@/services/userService";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { useTheme } from "@/components/ThemeContext";
import { theme } from "@/styles/Theme";
import { useLanguage } from "@/context/LanguageContext";

interface DassResponse {
  timestamp: string;
  analysis: {
    scaleScores: {
      depression: number;
      anxiety: number;
      stress: number;
    };
    severity: {
      depression: string;
      anxiety: string;
      stress: string;
    };
  };
}

interface DassAnalysisScreenProps {
  patientId: string;
}

type ScaleType = "depression" | "anxiety" | "stress";
type SeverityLevel =
  | "normal"
  | "mild"
  | "moderate"
  | "severe"
  | "extremely severe";

const DassAnalysisScreen: React.FC<DassAnalysisScreenProps> = ({
  patientId,
}) => {
  const [dassResponses, setDassResponses] = useState<DassResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const { t, isRTL } = useLanguage();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDassResponses();
  }, [patientId]);

  const fetchDassResponses = async () => {
    try {
      setError(null);
      // console.log("Fetching DASS responses for patient:", patientId);
      const response = await userService.getDassResponses(patientId);
      // console.log("Received response:", response);

      if (response?.success && Array.isArray(response.responses)) {
        setDassResponses(response.responses);
      } else {
        setError("Could not load DASS responses");
        setDassResponses([]);
      }
    } catch (error) {
      console.error("Error fetching DASS responses:", error);
      setError("Error loading DASS responses");
      setDassResponses([]);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <ThemedView className="flex-1 p-4">
        <ThemedText className="text-lg text-center text-error" isRTL={isRTL}>
          {error}
        </ThemedText>
      </ThemedView>
    );
  }

  const getSeverityColor = (severity: string): string => {
    switch (severity.toLowerCase()) {
      case "normal":
        return colors.success;
      case "mild":
        return colors.warning;
      case "moderate":
        return "#FF9800";
      case "severe":
      case "extremely severe":
        return colors.error;
      default:
        return colors.text;
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!dassResponses?.length) {
    return (
      <ThemedView className="flex-1 p-4">
        <ThemedText className="text-lg text-center" isRTL={isRTL}>
          {t.dassAnalysis.noData}
        </ThemedText>
      </ThemedView>
    );
  }

  const latestResponse = dassResponses[dassResponses.length - 1];
  const scales: ScaleType[] = ["depression", "anxiety", "stress"];

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <View className="p-4">
        <ThemedText className="text-2xl font-bold mb-6 text-center">
          {t.dassAnalysis.title}
        </ThemedText>

        {/* Latest Results Card */}
        <View className="bg-card rounded-lg p-4 mb-6">
          <ThemedText className="text-xl font-semibold mb-4" isRTL={isRTL}>
            {t.dassAnalysis.latestResults}
          </ThemedText>

          {scales.map((scale) => (
            <View
              key={scale}
              className={`justify-between items-center mb-3 ${
                isRTL ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <ThemedText className="" isRTL={isRTL}>
                {t.dassAnalysis[scale]}:
              </ThemedText>
              <View className="flex-row">
                <ThemedText className="font-semibold mr-2 text-xl">
                  {latestResponse.analysis.scaleScores[scale]}
                </ThemedText>
                <ThemedText className="font-semibold mr-2 text-xl">
                  points,
                </ThemedText>
                <ThemedText
                  style={{
                    color: getSeverityColor(
                      latestResponse.analysis.severity[scale]
                    ),
                  }}
                  className="font-semibold mr-2 text-xl"
                >
                  {latestResponse.analysis.severity[scale]}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        {/* History List */}
        <View className="bg-card rounded-lg p-4">
          <ThemedText className="text-xl font-semibold mb-4" isRTL={isRTL}>
            {t.dassAnalysis.history}
          </ThemedText>

          {dassResponses
            .slice()
            .reverse()
            .map((response, index) => (
              <View
                key={index}
                className="border-b border-border pb-3 mb-3"
                style={
                  index === dassResponses.length - 1
                    ? { borderBottomWidth: 0 }
                    : {}
                }
              >
                <ThemedText className="font-semibold mb-2" isRTL={isRTL}>
                  {new Date(response.timestamp).toLocaleDateString()}
                </ThemedText>

                {scales.map((scale) => (
                  <View
                    key={scale}
                    className={`justify-between mb-1 ${
                      isRTL ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <ThemedText>{t.dassAnalysis[scale]}:</ThemedText>
                    <View className="flex-row">
                      <ThemedText className="mr-2">
                        {response.analysis.scaleScores[scale]}
                      </ThemedText>
                      <ThemedText>points, </ThemedText>
                      <ThemedText
                        style={{
                          color: getSeverityColor(
                            response.analysis.severity[scale]
                          ),
                        }}
                      >
                        {response.analysis.severity[scale]}
                      </ThemedText>
                    </View>
                  </View>
                ))}
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default DassAnalysisScreen;
