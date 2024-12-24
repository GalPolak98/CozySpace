import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useTheme } from "@/components/ThemeContext";
import { theme } from "@/styles/Theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnxietyHandleSimulation } from "@/components/AnxietyHandleSimulation";

interface Patient {
  userId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function AdminHomeScreen() {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const insets = useSafeAreaInsets();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showMonitor, setShowMonitor] = useState(false);
  const [monitoringStates, setMonitoringStates] = useState<
    Record<string, boolean>
  >({});

  const fetchPatients = async () => {
    try {
      setError(null);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/admin/patients`
      );
      const data = await response.json();
      if (data.success) {
        setPatients(data.patients);
        setFilteredPatients(data.patients);
      } else {
        setError("Failed to fetch patients");
      }
    } catch (err) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchQuery, patients]);

  const filterPatients = () => {
    const query = searchQuery.toLowerCase();
    const filtered = patients.filter((patient) => {
      const fullName =
        `${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`.toLowerCase();
      return (
        fullName.includes(query) || patient.userId.toLowerCase().includes(query)
      );
    });
    setFilteredPatients(filtered);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPatients();
  }, []);

  const renderPatientCard = (patient: Patient) => {
    return (
      <View
        key={patient.userId}
        style={[
          styles.patientCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.patientInfo}>
          <Text style={[styles.patientName, { color: colors.text }]}>
            {patient.personalInfo.firstName} {patient.personalInfo.lastName}
          </Text>
          <Text style={[styles.patientEmail, { color: colors.textSecondary }]}>
            {patient.personalInfo.email}
          </Text>
          <Text style={[styles.patientId, { color: colors.textSecondary }]}>
            ID: {patient.userId}
          </Text>
        </View>

        <View>
          <AnxietyHandleSimulation patientId={patient.userId} />
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 16,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          <Text style={[styles.title, { color: colors.text }]}>
            Patient Management
          </Text>

          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Search patients by name or ID..."
            placeholderTextColor={colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {error ? (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {error}
            </Text>
          ) : (
            <View style={styles.patientsList}>
              {filteredPatients.map(renderPatientCard)}

              {filteredPatients.length === 0 && (
                <View style={styles.noResultsContainer}>
                  <Text
                    style={[
                      styles.noResultsText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    No patients found
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 16,
  },
  connectionWarning: {
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#ffebee",
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },
  searchInput: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  errorText: {
    marginBottom: 16,
    fontFamily: "Poppins-Regular",
  },
  patientsList: {
    gap: 12,
  },
  patientCard: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    marginBottom: 4,
  },
  patientEmail: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    marginBottom: 2,
  },
  patientId: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  noResultsContainer: {
    padding: 16,
    alignItems: "center",
  },
  noResultsText: {
    fontFamily: "Poppins-Regular",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
