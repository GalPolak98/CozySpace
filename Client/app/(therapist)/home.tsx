import React, { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeContext";
import { theme } from "@/styles/Theme";
import { 
  View, 
  Alert, 
  StyleSheet, 
  ActivityIndicator, 
  FlatList,
  Modal,
  TouchableOpacity,
  Pressable 
} from "react-native";
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
import { Ionicons } from '@expo/vector-icons';

type Patient = {
  _id: string;
  fullName: string;
  userId: string;
};

const TherapistHomeScreen = () => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const { isRTL, t, getGenderedText } = useLanguage();
  const userId = useAuth();
  const { gender, fullName } = useUserData(userId);
  const [modalVisible, setModalVisible] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [patientProfile, setPatientProfile] = useState<any>(null);
  const [personalDocumentation, setPersonalDocumentation] = useState<boolean>(false);
  const [anxietyTracking, setAnxietyTracking] = useState<boolean>(false);



  useEffect(() => {
    if (!userId) {
      console.error("Cannot fetch therapists: User ID is null.");
      return;
    }
  
    const fetchTherapists = async () => {
      console.log("Fetching therapists for User ID:", userId);
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
  }, [userId, t]);
  
  

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

  const renderWelcomeSection = () => (
    <View className="items-center mb-2" style={{ marginTop: 20 }}> 
      <View className="bg-blue-100 rounded-full p-6 mb-4">
        <Icon name="doctor" size={30} color={colors.primary} />
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
  );

  const renderPickerSection = () => (
    <View>
    <ThemedText
      style={[
        styles.selectedText,
        { color: colors.text },
        isRTL && { textAlign: 'right' } // Adjust text alignment for RTL
      ]}
    >
      {t.common.selectPatientMessage}
    </ThemedText>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={[styles.pickerContainer, { borderColor: colors.border, backgroundColor: colors.background }]}
      >
        <View style={styles.pickerButton}>
          <ThemedText style={[styles.selectedText, { color: colors.text }]}>
            {selectedPatient ? patients.find(p => p.userId === selectedPatient)?.fullName : t.common.select}
          </ThemedText>
          <Ionicons 
            name="chevron-down" 
            size={16} 
            color={colors.primary}
          />
        </View>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: colors.background }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={[styles.modalTitle, { color: colors.text }]}>
                {t.common.select}
              </ThemedText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <ThemedText style={{ color: colors.primary }}>
                  {t.common.close}
                </ThemedText>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={patients}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    setSelectedPatient(item.userId);
                    setModalVisible(false);
                  }}
                >
                  <ThemedText style={[
                    styles.optionText,
                    { color: colors.text },
                    selectedPatient === item.userId && { color: colors.primary }
                  ]}>
                    {item.fullName}
                  </ThemedText>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );

  const renderItem = () => (
    <View className="px-1 py-1 flex-1">
      {renderWelcomeSection()}
      {renderPickerSection()}
  
      {/* Display the "no shared info" message only after selecting a patient */}
      {selectedPatient && !anxietyTracking && !personalDocumentation && (
        <View style={{ alignItems: 'center', marginTop: 50 }}>
          <ThemedText style={{ color: colors.text, textAlign: 'center' }}>
            {t.common.noSharedInfo}
          </ThemedText>
        </View>
      )}
  
      {/* Render the patient's information if available */}
      {anxietyTracking && (
        <View>
          <ReportsScreen patientId={selectedPatient} />
        </View>
      )}
  
      {personalDocumentation && (
        <View style={{ height: 300 }}>
          <NotesScreen patientId={selectedPatient} />
        </View>
      )}
    </View>
  );
  

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
      <FlatList
        data={[1]}
        renderItem={renderItem}
        keyExtractor={() => 'main'}
        ListFooterComponent={() => <View style={{ paddingBottom: 10 }} />}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 5,
    backgroundColor: '#f8fafc',
    position: 'relative',
  },
  picker: {
    height: 30,
    width: "100%",
    paddingHorizontal: 16,
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '30%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  optionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  selectedText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    padding: 15,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
});

export default TherapistHomeScreen;