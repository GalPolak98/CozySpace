import React, { useEffect, useState } from "react";
import { View, Alert, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import CustomButton from "@/components/CustomButton";
import { useTheme } from "@/components/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

type RouteType = "/notesInfo" | "/recordingInfo";

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  route: RouteType;
}

const InformationPatient = () => {
  const { theme: currentTheme } = useTheme();
  const { isRTL, t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);



  const handleNavigation = async (route: RouteType) => {
    setIsLoading(true);
    try {
      switch (route) {
        case "/notesInfo":
          router.push({ pathname: "/notesInfo" });
          break;
        case "/recordingInfo":
          router.push({ pathname: "/recordingInfo" });
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
      title: t.information.notes,
      icon: (
        <MaterialIcons
          name="notes"
          size={28}
          color={currentTheme === "light" ? "#000000" : "#FFFFFF"}
        />
      ),
      route: "/notesInfo",
    },
    {
      title: t.information.recordings,
      icon: (
        <MaterialIcons
          name="record-voice-over"
          size={28}
          color={currentTheme === "light" ? "#000000" : "#FFFFFF"}
        />
      ),
      route: "/recordingInfo",
    },
  ];

  return (
    <ThemedView className="flex-1">
      <View className="px-4 py-6">
        
        <ThemedText className="text-2xl font-bold mb-4">
          {t.information.patientInformation}
        </ThemedText>
        <ThemedText className="text-base mb-6 opacity-80">
        {t.information.patientInformationDescription}
        </ThemedText>

        <View className="space-y-4">
          {menuItems.map((item, index) => {
            // Staggering animation for each item using a delay
            const itemFadeAnim = new Animated.Value(0);
            const itemSlideAnim = new Animated.Value(50);
            useEffect(() => {
              Animated.sequence([
                Animated.delay(index * 100), // Delay for each item (100ms delay per item)
                Animated.timing(itemFadeAnim, {
                  toValue: 1,
                  duration: 800,
                  useNativeDriver: true,
                }),
                Animated.timing(itemSlideAnim, {
                  toValue: 0,
                  duration: 800,
                  useNativeDriver: true,
                }),
              ]).start();
            }, [index]);

            return (
              <Animated.View
                key={index}
                style={{
                  opacity: itemFadeAnim,
                  transform: [{ translateY: itemSlideAnim }],
                }}
              >
                <CustomButton
                  title={`${item.title}`}
                  handlePress={() => handleNavigation(item.route)}
                  icon={item.icon}
                  iconPosition={isRTL ? "right" : "left"}
                  variant="primary"
                  isLoading={isLoading}
                  isRTL={isRTL}
                  containerStyles={{
                    paddingHorizontal: 24,
                    paddingVertical: 16,
                    marginBottom: 16,
                    borderRadius: 12,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 3,
                  }}
                />
              </Animated.View>
            );
          })}
        </View>
      </View>
    </ThemedView>
  );
};

export default InformationPatient;
