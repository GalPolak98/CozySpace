import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useTheme } from "@/components/ThemeContext";
import { theme } from "@/styles/Theme";
import { useAnxietyMonitor } from "@/hooks/useAnxietyMonitor";
import { websocketManager } from "@/services/websocketManager";
import { Ionicons } from "@expo/vector-icons";
import ThemedText from "../ThemedText";

const { width: screenWidth } = Dimensions.get("window");

export const AnxietyDataViewer: React.FC<{ userId: string }> = ({ userId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const {
    sensorData,
    analysis,
    lastUpdate: lastUpdateTime,
    isConnected,
  } = useAnxietyMonitor(userId);

  useEffect(() => {
    return () => {
      const namespace = `user_${userId}`;
      websocketManager.removeAllListeners(`sensorData_${namespace}`);
    };
  }, [userId]);

  const renderContent = () => {
    if (!isConnected) {
      return (
        <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
          Connecting to sensor data...
        </Text>
      );
    }

    if (!sensorData || !analysis) {
      return (
        <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
          Waiting for sensor data...
        </Text>
      );
    }

    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={[styles.dataCard, { backgroundColor: colors.surface }]}>
            <View style={styles.dataRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                HRV:
              </Text>
              <Text
                style={[styles.value, { color: colors.text }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {sensorData.hrvData.value.toFixed(2)} ms
              </Text>
            </View>
            <View style={styles.qualityRow}>
              <Text
                style={[styles.qualityText, { color: colors.textSecondary }]}
              >
                Quality: {sensorData.hrvData.quality}%
              </Text>
            </View>

            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            <View style={styles.dataRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                EDA:
              </Text>
              <Text
                style={[styles.value, { color: colors.text }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {sensorData.edaData.value.toFixed(2)} µS
              </Text>
            </View>
            <View style={styles.qualityRow}>
              <Text
                style={[styles.qualityText, { color: colors.textSecondary }]}
              >
                Quality: {sensorData.edaData.quality}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Analysis
          </Text>
          <View style={[styles.dataCard, { backgroundColor: colors.surface }]}>
            <View style={styles.dataRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Status:
              </Text>
              <Text
                style={[
                  styles.value,
                  { color: analysis.isAnxious ? colors.error : colors.success },
                ]}
                numberOfLines={1}
              >
                {analysis.isAnxious ? "Anxiety Detected" : "Normal State"}
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Confidence:
              </Text>
              <Text
                style={[styles.value, { color: colors.text }]}
                numberOfLines={1}
              >
                {(analysis.confidence * 100).toFixed(1)}%
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Severity:
              </Text>
              <Text
                style={[styles.value, { color: colors.text }]}
                numberOfLines={1}
              >
                {analysis.severity}
              </Text>
            </View>
            {analysis.triggers && analysis.triggers.length > 0 && (
              <View style={styles.triggersContainer}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                  Triggers:
                </Text>
                {analysis.triggers.map((trigger, index) => (
                  <Text
                    key={index}
                    style={[styles.triggerItem, { color: colors.text }]}
                    numberOfLines={2}
                  >
                    • {trigger}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>

        {lastUpdateTime && (
          <Text
            style={[styles.updateTime, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            Last updated: {lastUpdateTime.toLocaleTimeString()}
          </Text>
        )}
      </ScrollView>
    );
  };

  return (
    <View style={styles.containerWrapper}>
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        style={styles.headerContainer}
      >
        <Ionicons
          name={isExpanded ? "chevron-down" : "chevron-forward"}
          size={24}
          color={colors.text}
        />
        <ThemedText className="text-xl font-psemibold ml-4" numberOfLines={1}>
          Sensor Data
        </ThemedText>
      </TouchableOpacity>

      {isExpanded && renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  section: {
    marginBottom: 16,
  },
  containerWrapper: {
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 8,
  },
  dataCard: {
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  qualityRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    flex: 2,
    textAlign: "right",
  },
  qualityText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  triggersContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  triggerItem: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    marginLeft: 16,
    marginTop: 4,
  },
  updateTime: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  noDataText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginVertical: 20,
    paddingHorizontal: 16,
  },
});
