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
  Pressable,
} from "react-native";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import { useLanguage } from "@/context/LanguageContext";
import useAuth from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { userService } from "@/services/userService";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";

type Patient = {
  _id: string;
  fullName: string;
  userId: string;
};

type RouteType = "/patientNotes" | "/patientReports" | "/dassAnalysis";

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  route: RouteType;
}

const TherapistHomeScreen = () => {
  const router = useRouter();
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
  const [personalDocumentation, setPersonalDocumentation] =
    useState<boolean>(false);
  const [anxietyTracking, setAnxietyTracking] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTherapists = async () => {
      if (!userId) return; // Prevent fetching with invalid userId
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
        const data = await response.json();
        setPatients(data.patients || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, [userId]);

  useEffect(() => {
    if (selectedPatient) {
      fetchPatientProfile(selectedPatient);
    }
    console.log("Selected patient changed:", selectedPatient);
  }, [selectedPatient]);

  const handleNavigation = async (route: RouteType) => {
    setIsLoading(true);
    try {
      switch (route) {
        case "/patientNotes":
          router.push({
            pathname: "../notesInfo",
            params: { gender, patientId: selectedPatient },
          });
          break;
        case "/patientReports":
          router.push({
            pathname: "../reports",
            params: { gender, patientId: selectedPatient },
          });

          break;
        case "/dassAnalysis":
          router.push({
            pathname: "../dassAnalysis",
            params: { gender, patientId: selectedPatient },
          });
          break;
      }
    } catch (error) {
      Alert.alert(t.errors.error, t.errors.unexpected);
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems: MenuItem[] = [
    {
      title: getGenderedText(t.homeTherapist.patientNotes, gender as string),
      icon: (
        <MaterialIcons
          name="note-add"
          size={24}
          color={currentTheme === "light" ? "#000000" : "#FFFFFF"}
        />
      ),
      route: "/patientNotes",
    },
    {
      title: getGenderedText(t.homeTherapist.patientReports, gender as string),
      icon: (
        <MaterialIcons
          name="report"
          size={24}
          color={currentTheme === "light" ? "#000000" : "#FFFFFF"}
        />
      ),
      route: "/patientReports",
    },
    {
      title: getGenderedText(t.homeTherapist.dassAnalysis, gender as string),
      icon: (
        <MaterialIcons
          name="analytics"
          size={24}
          color={currentTheme === "light" ? "#000000" : "#FFFFFF"}
        />
      ),
      route: "/dassAnalysis",
    },
  ];

  const fetchPatientProfile = async (selectedPatientId: string) => {
    console.log("Fetching profile for selected patient:", selectedPatientId);
    try {
      if (!selectedPatientId) return;

      setLoading(true);

      const profile = await userService.getUserProfile(selectedPatientId);

      setPatientProfile(profile);

      const dataSharing = profile.therapistInfo?.dataSharing;
      setPersonalDocumentation(dataSharing?.personalDocumentation || false);
      setAnxietyTracking(dataSharing?.anxietyTracking || false);
    } catch (error) {
      // Alert.alert(t.errors.error, t.errors.loadError);
      console.error("Error fetching selected patient profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderWelcomeSection = () => (
    <View className="px-4 py-6 bg-gradient-to-br from-blue-50 to-blue-200 rounded-3xl mx-4 mb-2">
      <View className="items-center">
        {/* Icon with Background */}
        <View className="bg-blue-100 rounded-full p-4 mb-4">
          <FontAwesome5 name="user-md" size={40} color={colors.primary} />
        </View>

        {/* Welcome Text */}
        <ThemedText
          className="font-psemibold text-xl text-center"
          isRTL={isRTL}
          style={{ color: colors.text }}
        >
          {getGenderedText(t.common.welcome, gender as string)}
        </ThemedText>

        {/* Therapist's Name */}
        <ThemedText
          className="font-pbold text-2xl text-center mt-2"
          style={{ color: colors.primary }}
        >
          {fullName}
        </ThemedText>

        <View className="w-12 h-1 rounded-full bg-gray-300 dark:bg-gray-600 mt-4 mb-2" />
      </View>
    </View>
  );

  const renderPickerSection = () => (
    <View
      style={[
        styles.pickerSection,
        {
          paddingVertical: 5,
          paddingHorizontal: 16,
          borderRadius: 16,
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
        },
      ]}
    >
      {/* Label Section */}
      <View
        style={[
          styles.labelContainer,
          {
            marginBottom: 8,
            flexDirection: isRTL ? "row-reverse" : "row",
            alignItems: "center",
          },
        ]}
      >
        <FontAwesome5
          name="user-friends"
          size={16}
          color={colors.primary}
          style={{
            marginRight: isRTL ? 0 : 8,
            marginLeft: isRTL ? 8 : 0,
          }}
        />
        <ThemedText
          style={[
            styles.labelText,
            {
              color: colors.text,
              fontWeight: "bold",
              fontSize: 14,
            },
            isRTL && { textAlign: "right" },
          ]}
        >
          {getGenderedText(t.common.selectPatientMessage, gender as string)}
        </ThemedText>
      </View>

      {/* Picker Section */}
      <Pressable
        onPress={() => setModalVisible(true)}
        style={[
          styles.pickerContainer,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.background,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
          },
        ]}
      >
        <ThemedText
          style={[
            styles.selectedText,
            {
              color: colors.text,
              flex: 1,
              fontSize: 16,
              fontWeight: selectedPatient ? "bold" : "normal",
            },
            isRTL && { textAlign: "right" },
          ]}
        >
          {selectedPatient
            ? patients.find((p) => p.userId === selectedPatient)?.fullName
            : t.common.select}
        </ThemedText>
        <Ionicons name="chevron-down" size={20} color={colors.text} />
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end">
          {/* Overlay to close modal */}
          <Pressable
            className="flex-1 bg-black/30"
            onPress={() => setModalVisible(false)}
          />
          {/* Modal Content */}
          <ThemedView variant="surface" className="rounded-t-3xl">
            {/* Header */}
            <View className="items-center py-4 border-b border-gray-200 dark:border-gray-700">
              <View className="w-12 h-1 rounded-full bg-gray-300 dark:bg-gray-600 mb-2" />
              <ThemedText variant="primary" className="text-xl font-pbold">
                {t.common.select}
              </ThemedText>
            </View>

            {/* Patient List */}
            <FlatList
              data={patients}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedPatient(item.userId);
                    setModalVisible(false);
                  }}
                  style={{
                    backgroundColor:
                      selectedPatient === item.userId
                        ? `${colors.primary}20`
                        : currentTheme === "light"
                          ? "#F9FAFB"
                          : "#1F2937",
                    flexDirection: isRTL ? "row-reverse" : "row", // Adjust item layout direction
                  }}
                  className="flex-row items-center justify-between p-4 mb-2 rounded-xl"
                >
                  <ThemedText
                    variant="primary"
                    className={`text-lg font-pbold ${
                      selectedPatient === item.userId ? "text-primary" : ""
                    }`}
                  >
                    {item.fullName}
                  </ThemedText>
                </TouchableOpacity>
              )}
            />

            {/* Cancel Button */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor:
                  currentTheme === "light" ? "#F3F4F6" : "#1F2937",
              }}
              className="mx-4 mb-4 p-4 rounded-xl items-center"
            >
              <ThemedText
                variant="primary"
                className="text-base font-psemibold"
              >
                {t.common.cancel}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </View>
      </Modal>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionContainer}>
      {selectedPatient && !anxietyTracking && !personalDocumentation && (
        <View
          style={[
            styles.noInfoContainer,
            {
              backgroundColor: currentTheme === "light" ? "#f9fafb" : "#1f2937",
            },
          ]}
        >
          <MaterialIcons
            name="info-outline"
            size={32}
            color={currentTheme === "light" ? colors.text : "#9ca3af"}
          />
          <ThemedText style={[styles.noInfoText, { color: colors.text }]}>
            {t.common.noSharedInfo}
          </ThemedText>
        </View>
      )}

      {personalDocumentation && (
        <View style={styles.buttonContainer}>
          <CustomButton
            title={menuItems[0].title}
            handlePress={() => handleNavigation(menuItems[0].route)}
          />
        </View>
      )}

      {anxietyTracking && (
        <View style={styles.buttonContainer}>
          <CustomButton
            title={menuItems[1].title}
            handlePress={() => handleNavigation(menuItems[1].route)}
          />
        </View>
      )}

      {anxietyTracking && (
        <View style={styles.buttonContainer}>
          <CustomButton
            title={menuItems[2].title}
            handlePress={() => handleNavigation(menuItems[2].route)}
          />
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText style={styles.loadingText}>{t.common.loading}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={[1]}
        renderItem={() => (
          <View style={styles.content}>
            {renderWelcomeSection()}
            {renderPickerSection()}
            {renderActionButtons()}
          </View>
        )}
        keyExtractor={() => "main"}
        ListFooterComponent={() => <View style={styles.footer} />}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  welcomeContainer: {
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 24,
    backgroundColor: "#EBF4FF",
    padding: 24,
  },
  welcomeContent: {
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "white",
    borderRadius: 50,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 24,
    textAlign: "center",
  },
  nameText: {
    fontFamily: "Poppins-Bold",
    fontSize: 28,
    marginTop: 8,
    textAlign: "center",
  },
  pickerSection: {
    paddingHorizontal: 16,
  },
  labelContainer: {
    marginBottom: 16,
  },
  labelText: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
  },
  pickerContainer: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    maxHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
  },
  closeButton: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  patientOption: {
    borderRadius: 12,
    marginBottom: 8,
    padding: 16,
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  selectedText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    padding: 16,
  },
  actionContainer: {
    paddingHorizontal: 16,
    marginTop: 32,
  },
  noInfoContainer: {
    backgroundColor: "#f9fafb",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  noInfoText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    fontFamily: "Poppins-Regular",
  },
  buttonContainer: {
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  footer: {
    paddingBottom: 20,
  },
});

export default TherapistHomeScreen;
