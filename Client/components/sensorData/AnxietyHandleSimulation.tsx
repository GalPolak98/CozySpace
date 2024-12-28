import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/components/ThemeContext";
import { theme } from "@/styles/Theme";
import { sensorService } from "@/services/sensorService";

interface MetricBoxProps {
  label: string;
  value: number;
  unit: string;
  quality: number;
}

interface AnxietyMonitorProps {
  patientId: string;
}

const MetricBox: React.FC<MetricBoxProps> = ({
  label,
  value,
  unit,
  quality,
}) => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  return (
    <View style={[styles.metricBox, { backgroundColor: colors.surface }]}>
      <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.metricValue, { color: colors.text }]}>
        {value.toFixed(1)} {unit}
      </Text>
      <Text style={[styles.metricQuality, { color: colors.textSecondary }]}>
        Quality: {quality.toFixed(1)}%
      </Text>
    </View>
  );
};

export const AnxietyHandleSimulation: React.FC<AnxietyMonitorProps> = ({
  patientId,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  const handleStartMonitoring = async () => {
    try {
      console.log("Starting monitoring for patient:", patientId);
      setLoading(true);
      setError(null);

      const response = await sensorService.startSensorSimulation(patientId, {
        userId: patientId,
        isActive: true,
        samplingRate: 5000,
      });

      console.log("Start monitoring response:", response);
      if (response.success) {
        setIsMonitoring(true);
      }
    } catch (err) {
      console.error("Start monitoring error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to start monitoring"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStopMonitoring = async () => {
    try {
      console.log("Stopping monitoring for patient:", patientId);
      setLoading(true);
      setError(null);

      const response = await sensorService.stopSensorSimulation(patientId);

      console.log("Stop monitoring response:", response);
      if (response.success) {
        setIsMonitoring(false);
      }
    } catch (err) {
      console.error("Stop monitoring error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to stop monitoring"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.controlsContainer}>
      {isMonitoring ? (
        <TouchableOpacity
          style={[
            styles.button,
            styles.stopButton,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleStopMonitoring}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Stop Simulation</Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.button,
            styles.startButton,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleStartMonitoring}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Start Simulation</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    marginTop: 8,
    fontFamily: "Poppins-Regular",
  },
  connectionStatus: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginTop: 4,
    textAlign: "right",
  },
  controlsContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#4CAF50",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stopButton: {
    backgroundColor: "#F44336",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: "#FFF",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  metricsContainer: {
    gap: 16,
  },
  metricBox: {
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    marginVertical: 4,
  },
  metricQuality: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 2,
  },
  anxietyStatus: {
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  anxietyDetected: {
    backgroundColor: "#ffebee",
  },
  anxietyNormal: {
    backgroundColor: "#e8f5e9",
  },
  anxietyStatusText: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
  },
  confidenceText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginTop: 4,
  },
  triggersContainer: {
    marginTop: 12,
  },
  triggersTitle: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
  },
  triggerText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginLeft: 8,
    marginTop: 2,
  },
  monitoringActive: {
    color: "#4CAF50",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginTop: 8,
    textAlign: "center",
  },
});
