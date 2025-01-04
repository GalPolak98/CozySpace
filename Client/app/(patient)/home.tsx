import React, { useEffect, useState } from "react";
import { ScrollView, View, Alert, AppState } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import CustomButton from "@/components/CustomButton";
import RecordingsSection from "../recording";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/components/ThemeContext";
import * as Location from "expo-location";
import useAuth from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import Loader from "@/components/Loader";
import { useWebSocketConnection } from "@/hooks/useWebSocketConnection";
import { AnxietyDataViewer } from "@/components/sensorData/AnxietyDataViewer";
import { useFeatures } from "@/hooks/useFeatures";
import { useDassQuestionnaire } from "@/hooks/useDassQuestionnaire";
import { DassQuestionnaire } from "@/components/monthlyQuestionnaire/MonthlyAssessment";
import { useAnxietyMonitor } from "@/hooks/useAnxietyMonitor";

type RouteType =
  | "/chat"
  | "/guidedNote"
  | "/directNote"
  | "/breathingExercises";

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  route: RouteType;
}

const HomePatient = () => {
  const router = useRouter();
  const { isRTL, t, getGenderedText } = useLanguage();
  const { theme: currentTheme } = useTheme();
  const [locationPermission, setLocationPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useAuth();
  const { isConnected, error: wsError } = useWebSocketConnection(
    userId as string
  );
  const {
    gender,
    fullName,
    isLoading: userDataLoading,
    error: userDataError,
  } = useUserData(userId);
  const { features } = useFeatures();
  const {
    shouldShow,
    isLoading: dassLoading,
    hideQuestionnaire,
  } = useDassQuestionnaire(userId);
  const { isAnxious } = useAnxietyMonitor(userId as string);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (userDataError) {
      Alert.alert(t.errors.error, t.errors.unexpected);
    }
  }, [userDataError, t.errors]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");
    } catch (error) {
      console.error("Error requesting location permission:", error);
      Alert.alert(t.errors.error, t.location.errorMessage);
    }
  };

  const handleNavigation = async (route: RouteType) => {
    if (!gender) {
      Alert.alert(t.errors.error, t.errors.unexpected);
      return;
    }

    setIsLoading(true);
    try {
      switch (route) {
        case "/chat":
          router.push({
            pathname: "/chat",
            params: { gender },
          });
          break;
        case "/guidedNote":
          router.push({
            pathname: "/guidedNote",
            params: { gender },
          });
          break;
        case "/directNote":
          router.push({
            pathname: "/directNote",
            params: { gender },
          });
          break;
        case "/breathingExercises":
          router.push({
            pathname: "/breathingExercises",
            params: { gender },
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
    ...(features?.chat
      ? [
          {
            title: getGenderedText(t.homePatient.talkToAI, gender as string),
            icon: (
              <MaterialIcons
                name="chat"
                size={24}
                color={currentTheme === "light" ? "#000000" : "#FFFFFF"}
              />
            ),
            route: "/chat" as RouteType,
          },
        ]
      : []),
    ...(features?.guidedNote
      ? [
          {
            title: getGenderedText(
              t.homePatient.guidedDocumenting,
              gender as string
            ),
            icon: (
              <MaterialIcons
                name="description"
                size={24}
                color={currentTheme === "light" ? "#000000" : "#FFFFFF"}
              />
            ),
            route: "/guidedNote" as RouteType,
          },
        ]
      : []),
    ...(features?.directNote
      ? [
          {
            title: getGenderedText(t.homePatient.documentNow, gender as string),
            icon: (
              <MaterialIcons
                name="edit"
                size={24}
                color={currentTheme === "light" ? "#000000" : "#FFFFFF"}
              />
            ),
            route: "/directNote" as RouteType,
          },
        ]
      : []),
    ...(features?.breathingExercises
      ? [
          {
            title: getGenderedText(t.breathing.menuTitle, gender as string),
            icon: (
              <MaterialIcons
                name="air"
                size={24}
                color={currentTheme === "light" ? "#000000" : "#FFFFFF"}
              />
            ),
            route: "/breathingExercises" as RouteType,
          },
        ]
      : []),
  ] as MenuItem[];

  if (dassLoading || userDataLoading || !gender || !fullName) {
    return <Loader isLoading={true} />;
  }

  const handleQuestionnaireComplete = () => {
    Alert.alert(t.common.success, t.questionnaire.savedSuccessfully, [
      {
        text: t.common.ok,
        onPress: () => hideQuestionnaire(),
      },
    ]);
  };

  if (shouldShow && !isAnxious) {
    return (
      <ThemedView className="flex-1">
        <DassQuestionnaire
          userId={userId as string}
          onComplete={handleQuestionnaireComplete}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
        {/* Welcome Message */}
        <View className="items-center mb-8">
          <ThemedText
            className="font-psemibold text-2xl text-center mt-4"
            isRTL={isRTL}
          >
            {getGenderedText(t.common.welcome, gender)}, {fullName}
          </ThemedText>
        </View>

        {/* Menu Items */}
        <View className="space-y-4 mt-4">
          {menuItems.map((item, index) => (
            <CustomButton
              key={index}
              title={item.title}
              handlePress={() => handleNavigation(item.route)}
              icon={item.icon}
              iconPosition={isRTL ? "right" : "left"}
              variant="primary"
              isLoading={isLoading}
              isRTL={isRTL}
              containerStyles={{
                paddingHorizontal: 35,
                paddingVertical: 12,
                marginBottom: 16,
                alignItems: isRTL ? "flex-end" : "flex-start",
                flexDirection: "column",
                gap: 8,
                width: "100%",
              }}
            />
          ))}
        </View>

        {/* Recordings Section */}
        {features?.recordings && (
          <View className="mt-8">
            <RecordingsSection />
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
};

export default HomePatient;
