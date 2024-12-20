import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { sensorService } from "@/services/sensorService";
import useAuth from "@/hooks/useAuth";
import { AnxietyAnalysis, SensorConfig, SensorData } from "@/types/sensorTypes";

interface AnxietyMetrics {
  sensorData: SensorData | null;
  analysis: AnxietyAnalysis | null;
}

interface MetricBoxProps {
  label: string;
  value: number;
  unit: string;
  quality: number;
  style?: StyleProp<ViewStyle>;
}

interface AnxietyStatusProps {
  isAnxious: boolean;
  confidence: number;
  triggers?: string[];
  style?: StyleProp<ViewStyle>;
}

const MetricBox: React.FC<MetricBoxProps> = ({
  label,
  value,
  unit,
  quality,
  style,
}) => (
  <View style={[styles.metricBox, style]}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>
      {value.toFixed(1)} {unit}
    </Text>
    <Text style={styles.metricQuality}>Quality: {quality}%</Text>
  </View>
);

const AnxietyStatus: React.FC<AnxietyStatusProps> = ({
  isAnxious,
  confidence,
  triggers,
  style,
}) => (
  <View
    style={[
      styles.anxietyStatus,
      isAnxious ? styles.anxietyDetected : styles.anxietyNormal,
      style,
    ]}
  >
    <Text style={styles.anxietyStatusText}>
      {isAnxious ? "Anxiety Detected" : "Normal State"}
    </Text>
    <Text style={styles.confidenceText}>
      Confidence: {(confidence * 100).toFixed(1)}%
    </Text>
    {triggers && triggers.length > 0 && (
      <View style={styles.triggersContainer}>
        <Text style={styles.triggersTitle}>Triggers:</Text>
        {triggers.map((trigger, index) => (
          <Text key={index} style={styles.triggerText}>
            • {trigger}
          </Text>
        ))}
      </View>
    )}
  </View>
);

export const AnxietyMonitor: React.FC = () => {
  const userId = useAuth();
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<AnxietyMetrics>({
    sensorData: null,
    analysis: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    if (isMonitoring && userId) {
      unsubscribe = sensorService.subscribeToSensorData((data) => {
        const { sensorData, analysis } = data;

        // Log only when anxiety is detected
        if (analysis.isAnxious) {
          console.log("\n[ANXIETY EVENT DETECTED]", {
            time: new Date(sensorData.timestamp).toLocaleTimeString(),
            metrics: {
              hrv: `${sensorData.hrvData.value.toFixed(
                1
              )}ms (quality: ${sensorData.hrvData.quality.toFixed(1)}%)`,
              eda: `${sensorData.edaData.value.toFixed(
                2
              )}µS (quality: ${sensorData.edaData.quality.toFixed(1)}%)`,
            },
            analysis: {
              confidence: `${(analysis.confidence * 100).toFixed(1)}%`,
              triggers: analysis.triggers || [],
            },
          });
        }

        setMetrics({
          sensorData,
          analysis,
        });
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isMonitoring, userId]);

  const handleStartMonitoring = async (): Promise<void> => {
    if (!userId) {
      setError("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const config: SensorConfig = {
        userId: userId,
        isActive: true,
        samplingRate: 1000,
      };
      await sensorService.startSensorSimulation(userId, config);
      setIsMonitoring(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start monitoring"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStopMonitoring = async (): Promise<void> => {
    if (!userId) {
      setError("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await sensorService.stopSensorSimulation(userId);
      setIsMonitoring(false);
      setMetrics({ sensorData: null, analysis: null });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to stop monitoring"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderMetrics = useCallback(() => {
    if (!metrics.sensorData || !metrics.analysis) return null;

    const { hrvData, edaData } = metrics.sensorData;
    const { isAnxious, confidence, triggers } = metrics.analysis;

    return (
      <View style={styles.metricsContainer}>
        <MetricBox
          label="Heart Rate Variability"
          value={hrvData.value}
          unit="ms"
          quality={hrvData.quality}
        />

        <MetricBox
          label="Electrodermal Activity"
          value={edaData.value}
          unit="µS"
          quality={edaData.quality}
        />

        <AnxietyStatus
          isAnxious={isAnxious}
          confidence={confidence}
          triggers={triggers}
        />
      </View>
    );
  }, [metrics]);

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please log in to use this feature</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Anxiety Monitor</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            isMonitoring ? styles.stopButton : styles.startButton,
            loading && styles.buttonDisabled,
          ]}
          onPress={isMonitoring ? handleStopMonitoring : handleStartMonitoring}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {isMonitoring && renderMetrics()}
    </ScrollView>
  );
};

interface Styles {
  container: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  errorText: TextStyle;
  controlsContainer: ViewStyle;
  button: ViewStyle;
  startButton: ViewStyle;
  stopButton: ViewStyle;
  buttonDisabled: ViewStyle;
  buttonText: TextStyle;
  metricsContainer: ViewStyle;
  metricBox: ViewStyle;
  metricLabel: TextStyle;
  metricValue: TextStyle;
  metricQuality: TextStyle;
  anxietyStatus: ViewStyle;
  anxietyDetected: ViewStyle;
  anxietyNormal: ViewStyle;
  anxietyStatusText: TextStyle;
  confidenceText: TextStyle;
  triggersContainer: ViewStyle;
  triggersTitle: TextStyle;
  triggerText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  errorText: {
    color: "#ff4444",
    marginTop: 8,
  },
  controlsContainer: {
    padding: 20,
    alignItems: "center",
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  stopButton: {
    backgroundColor: "#f44336",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  metricsContainer: {
    padding: 20,
    gap: 16,
  },
  metricBox: {
    backgroundColor: "#fff",
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
    color: "#666",
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 4,
  },
  metricQuality: {
    fontSize: 12,
    color: "#999",
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
    fontWeight: "bold",
    color: "#333",
  },
  confidenceText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  triggersContainer: {
    marginTop: 12,
  },
  triggersTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 4,
  },
  triggerText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
});

export default AnxietyMonitor;
