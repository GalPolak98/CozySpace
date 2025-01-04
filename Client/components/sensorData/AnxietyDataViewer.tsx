import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/components/ThemeContext";
import { theme } from "@/styles/Theme";
import { useAnxietyMonitor } from "@/hooks/useAnxietyMonitor";
import { websocketManager } from "@/services/websocketManager";
import { Ionicons } from "@expo/vector-icons";
import ThemedText from "../ThemedText";

interface AnxietyDataViewerProps {
  userId: string;
}

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
      >
        <View style={styles.section}>
          <View style={[styles.dataCard, { backgroundColor: colors.surface }]}>
            <View style={styles.dataRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                HRV:
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {sensorData.hrvData.value.toFixed(2)} ms (Quality:{" "}
                {sensorData.hrvData.quality}%)
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                EDA:
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {sensorData.edaData.value.toFixed(2)} µS (Quality:{" "}
                {sensorData.edaData.quality}%)
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
              >
                {analysis.isAnxious ? "Anxiety Detected" : "Normal State"}
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Confidence:
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {(analysis.confidence * 100).toFixed(1)}%
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Severity:
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
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
                  >
                    • {trigger}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>

        {lastUpdateTime && (
          <Text style={[styles.updateTime, { color: colors.textSecondary }]}>
            Last updated: {lastUpdateTime.toLocaleTimeString()}
          </Text>
        )}
      </ScrollView>
    );
  };

  return (
    <View style={styles.containerWrapper}>
      <View style={[styles.headerContainer]}>
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isExpanded ? "chevron-down" : "chevron-forward"}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <ThemedText className="font-psemibold text-2xl mt-4 ml-4 align-middle">
          Sensor Data
        </ThemedText>
      </View>

      {isExpanded && renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  containerWrapper: {
    borderRadius: 8,
    overflow: "hidden",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    alignContent: "center",
  },
  headerText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  sectionTitle: {
    fontSize: 18,
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
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  value: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  triggersContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  triggerItem: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginLeft: 16,
    marginTop: 4,
  },
  updateTime: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginTop: 8,
  },
  noDataText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginTop: 20,
  },
});
