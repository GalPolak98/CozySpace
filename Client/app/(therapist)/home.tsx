import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeContext";
import { theme } from "@/styles/Theme";
import { ScrollView, View, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import { useLanguage } from "@/context/LanguageContext";
import useAuth from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { userService } from "@/services/userService";
import NotesScreen from '../notesInfo';
import ReportsScreen from '../(patient)/reports'
type Patient = {
  _id: string;
  fullName: string;
  userId: string;
};

const TherapistHomeScreen = () => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];  // Access current theme colors
  const { isRTL, t, getGenderedText } = useLanguage();
  const userId = useAuth();
  const { gender, fullName, error: userDataError } = useUserData(userId);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [patientProfile, setPatientProfile] = useState<any>(null);
  const [personalDocumentation, setPersonalDocumentation] = useState<boolean>(false);
  const [anxietyTracking, setAnxietyTracking] = useState<boolean>(false);

  useEffect(() => {
    if (userDataError) {
      Alert.alert(t.errors.error, t.errors.unexpected);
    }
  }, [userDataError, t.errors]);

  useEffect(() => {
    const fetchTherapists = async () => {
      console.log("Fetching therapists....");
      try {
        const url = `${process.env.EXPO_PUBLIC_SERVER_URL}/api/therapists/${userId}/patients`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        const data = await response.json();
        setPatients(data.patients || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, [t]);

  useEffect(() => {
    if (selectedPatient) {
      fetchPatientProfile(selectedPatient);
    }
    console.log("Selected patient changed:", selectedPatient);
  }, [selectedPatient]);

  const fetchPatientProfile = async (selectedPatientId: string) => {
    console.log('Fetching profile for selected patient:', selectedPatientId);
    try {
      if (!selectedPatientId) return;

      setLoading(true);

      const profile = await userService.getUserProfile(selectedPatientId);

      setPatientProfile(profile);

      const dataSharing = profile.therapistInfo?.dataSharing;
      console.log('Data sharing:', dataSharing);
      setPersonalDocumentation(dataSharing?.personalDocumentation || false);
      setAnxietyTracking(dataSharing?.anxietyTracking || false);

      console.log('Fetched dataSharing:', dataSharing);

    } catch (error) {
      Alert.alert(t.errors.error, t.errors.loadError);
      console.error("Error fetching selected patient profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText className="mt-4">{t.common.loading}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
        <View className="px-1 py-1 flex-1">
          <View className="items-center mb-1">
            <View className="bg-blue-100 rounded-full p-6 mb-4">
              <Icon name="doctor" size={36} color={colors.primary} />
            </View>
            <ThemedText
              className="font-psemibold text-3xl text-center"
              isRTL={isRTL}
              style={{ color: colors.text }}
            >
              {getGenderedText(t.common.welcome, gender as string)},
            </ThemedText>
            <ThemedText
              className="font-pbold text-3xl text-center text-blue-600 mt-2"
              style={{ color: colors.primary }}
            >
              {fullName}
            </ThemedText>
          </View>

          <View style={[styles.pickerContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <Picker
              selectedValue={selectedPatient}
              onValueChange={setSelectedPatient}
              style={[styles.picker, { color: colors.text }]} // Picker text color changes based on theme
            >
              <Picker.Item label={t.common.select} value="" />
              {patients.map((patient) => (
                <Picker.Item
                  key={patient._id}
                  label={patient.fullName}
                  value={patient.userId}
                />
              ))}
            </Picker>
          </View>

          {anxietyTracking && (
            <View className="mt-4"> {/* Reduced marginTop here */}
              <ThemedText className="font-pbold text-lg" style={{ color: colors.primary }}>
                {t.common.anxietyTracking}
              </ThemedText>
              {/* Here we can display patient reports or more details */}
              <ReportsScreen patientId={selectedPatient} />
            </View>
          )}

          {personalDocumentation && (
            <NotesScreen patientId={selectedPatient} />
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 8, // Reduced marginBottom here
    backgroundColor: '#f8fafc',
    position: 'relative',
  },
  picker: {
    height: 50,
    width: "100%",
    paddingHorizontal: 16,
    fontSize: 16,
  },
});

export default TherapistHomeScreen;

