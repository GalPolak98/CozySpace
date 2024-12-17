import React, { useState, useEffect, useRef } from "react";
import { View, Dimensions, StyleSheet, ScrollView } from "react-native";
import { Audio } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/components/ThemeContext";
import { theme } from "@/styles/Theme";
import Loader from "@/components/Loader";
import CustomButton from "@/components/CustomButton";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ProgressPills } from "@/components/breathing/ProgressPills";
import { BreathingCircle } from "@/components/breathing/BreathingCircle";
import { Stats } from "@/components/breathing/Stats";
import { BreathingGuideModal } from "@/components/breathing/BreathingGuide";
import { PatternSelectionModal } from "@/components/breathing/PatternSelectionModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBreathingAnimation } from "@/hooks/useBreathingAnimation";
import {
  BreathingPatternType,
  BREATHING_PATTERNS,
  PhaseType,
} from "@/types/breathing";
import ThemedText from "@/components/ThemedText";

const BreathingScreen = () => {
  const { gender } = useLocalSearchParams<{ gender: string }>();
  const [isActive, setIsActive] = useState(false);
  const [sound, setSound] = useState<Audio.Sound>();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionCount, setSessionCount] = useState(0);
  const [isGuideVisible, setIsGuideVisible] = useState(false);
  const [isPatternModalVisible, setIsPatternModalVisible] = useState(false);
  const [currentPattern, setCurrentPattern] =
    useState<BreathingPatternType>("4-4-4-4");
  const insets = useSafeAreaInsets();
  const [sessionDuration, setSessionDuration] = useState(0);
  const sessionTimeRef = useRef<NodeJS.Timeout>();
  const { currentPhase, timeLeft, circleScale, circleOpacity } =
    useBreathingAnimation(isActive, currentPattern, sound);
  const { t, isRTL, getGenderedText } = useLanguage();
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const windowWidth = Dimensions.get("window").width;
  const baseCircleSize = Math.min(windowWidth * 0.6, 250);
  const maxCircleSize = baseCircleSize * 1.5;

  const handlePatternChange = async (newPattern: BreathingPatternType) => {
    try {
      if (isActive) {
        setIsActive(false);
      }
      if (sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }
        setSound(undefined);
      }
      setCurrentPattern(newPattern);
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          BREATHING_PATTERNS[newPattern].musicPath,
          { isLooping: true }
        );
        setSound(newSound);
      } catch (error) {
        console.error("Error creating new sound:", error);
      }
    } catch (error) {
      console.error("Error changing pattern:", error);
    }
  };

  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          staysActiveInBackground: true,
          playThroughEarpieceAndroid: false,
        });
        const { sound } = await Audio.Sound.createAsync(
          BREATHING_PATTERNS[currentPattern].musicPath,
          { isLooping: true }
        );
        setSound(sound);
      } catch (error) {
        console.error("Error setting up audio", error);
      } finally {
        setIsLoading(false);
      }
    };
    setupAudio();
    return () => {
      sound?.stopAsync().then(() => {
        sound?.unloadAsync();
      });
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      setSessionDuration(0);
      sessionTimeRef.current = setInterval(() => {
        setSessionDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (sessionTimeRef.current) {
        clearInterval(sessionTimeRef.current);
      }
    }
    return () => {
      if (sessionTimeRef.current) {
        clearInterval(sessionTimeRef.current);
      }
    };
  }, [isActive]);

  const toggleExercise = async () => {
    try {
      if (!isActive) {
        setIsActive(true);
        setSessionCount((prev) => prev + 1);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (sound) {
          await sound.playAsync();
          setIsMusicPlaying(true);
        }
      } else {
        setIsActive(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        if (sound) {
          await sound.stopAsync();
          await sound.setPositionAsync(0);
          setIsMusicPlaying(false);
        }
      }
    } catch (error) {
      console.error("Error toggling exercise:", error);
    }
  };

  const getPhaseText = (phase: PhaseType) => {
    const pattern = BREATHING_PATTERNS[currentPattern];

    if (!(phase in pattern.phases)) {
      return "";
    }

    return t.breathing[phase];
  };

  if (isLoading) {
    return <Loader isLoading={true} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            paddingHorizontal: 16,
          }}
        >
          {/* Title section */}
          <View
            style={{
              width: "100%",
              paddingHorizontal: 20,
              paddingBottom: 4,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <ThemedText
              style={{
                fontFamily: "Poppins-Regular",
                color: colors.textSecondary,
                marginTop: 4,
                textAlign: "center",
              }}
              className="text-xl"
            >
              {getGenderedText(t.breathing.focusMessage, gender)}
            </ThemedText>
          </View>

          {/* Progress Pills */}
          <View
            style={{
              width: "100%",
              marginTop: 8,
              marginBottom: 24,
              alignItems: "center",
            }}
          >
            <ProgressPills
              currentPhase={currentPhase}
              colors={colors}
              pattern={currentPattern}
            />
          </View>

          {/* Circle container */}
          <View
            style={{
              height: maxCircleSize,
              width: maxCircleSize,
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 16,
              flex: 1,
              maxHeight: windowWidth * 0.8, // Prevent circle from being too tall on Android
            }}
          >
            <BreathingCircle
              scale={circleScale}
              opacity={circleOpacity}
              size={baseCircleSize}
              phaseText={getPhaseText(currentPhase)}
              timeLeft={timeLeft}
              isActive={isActive}
              gender={gender}
            />
          </View>

          {/* Bottom section */}
          <View
            style={{
              width: "100%",
              alignItems: "center",
              paddingBottom: Math.max(20, insets.bottom + 10),
            }}
          >
            <Stats
              sessionDuration={sessionDuration}
              colors={colors}
              isGuided={isGuideVisible}
              onGuidePress={() => setIsGuideVisible(true)}
              currentPattern={currentPattern}
              onPatternPress={() => setIsPatternModalVisible(true)}
              gender={gender}
            />

            <CustomButton
              title={
                isActive
                  ? getGenderedText(t.breathing.stop, gender)
                  : getGenderedText(t.breathing.start, gender)
              }
              handlePress={toggleExercise}
              containerStyles={{
                paddingHorizontal: 48,
                paddingVertical: 16,
                borderRadius: 999,
                elevation: 4,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                marginTop: 10,
              }}
              textStyles={{
                fontSize: 18,
                fontFamily: "Poppins-SemiBold",
              }}
              icon={
                <MaterialIcons
                  name={isActive ? "stop" : "play-arrow"}
                  size={28}
                  color={colors.text}
                  style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
                />
              }
              iconPosition={isRTL ? "right" : "left"}
              variant={isActive ? "secondary" : "primary"}
              isRTL={isRTL}
            />
          </View>

          {/* Modals remain unchanged */}
          <BreathingGuideModal
            visible={isGuideVisible}
            onClose={() => setIsGuideVisible(false)}
            colors={colors}
            currentPattern={currentPattern}
            gender={gender}
          />

          <PatternSelectionModal
            visible={isPatternModalVisible}
            onClose={() => setIsPatternModalVisible(false)}
            onSelect={handlePatternChange}
            currentPattern={currentPattern}
            colors={colors}
            gender={gender}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default BreathingScreen;
