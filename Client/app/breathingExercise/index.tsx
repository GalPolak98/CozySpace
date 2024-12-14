import React, { useState, useEffect } from "react";
import { View, Animated, Dimensions } from "react-native";
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
import GenericHeader from "@/components/navigation/GenericHeader";

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

  // Use the custom animation hook
  const { currentPhase, timeLeft, circleScale, circleOpacity } =
    useBreathingAnimation(isActive, currentPattern);

  const { theme: currentTheme } = useTheme();
  const { t, isRTL, getGenderedText } = useLanguage();
  const colors = theme[currentTheme];

  const windowWidth = Dimensions.get("window").width;
  const baseCircleSize = Math.min(windowWidth * 0.6, 250);
  const maxCircleSize = baseCircleSize * 1.5;

  // Define breathing phases text
  const phases = {
    inhale: {
      text: t.breathing.inhale,
    },
    holdIn: {
      text: t.breathing.holdIn,
    },
    exhale: {
      text: t.breathing.exhale,
    },
    holdOut: {
      text: t.breathing.holdOut,
    },
  };

  // Handle pattern change
  const handlePatternChange = async (newPattern: BreathingPatternType) => {
    // If exercise is active, stop it
    if (isActive) {
      await toggleExercise();
    }

    // Change pattern
    setCurrentPattern(newPattern);

    // Reload audio with new pattern's music
    if (sound) {
      await sound.unloadAsync();
      const { sound: newSound } = await Audio.Sound.createAsync(
        BREATHING_PATTERNS[newPattern].musicPath,
        { isLooping: true }
      );
      setSound(newSound);
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

    // Cleanup function to stop and unload sound when component unmounts
    return () => {
      sound?.stopAsync().then(() => {
        sound?.unloadAsync();
      });
    };
  }, []);

  // Handle exercise start/stop
  const toggleExercise = async () => {
    try {
      if (!isActive) {
        // Starting the exercise
        setIsActive(true);
        setSessionCount((prev) => prev + 1);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (sound) {
          await sound.playAsync();
          setIsMusicPlaying(true);
        }
      } else {
        // Stopping the exercise
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

  const buttonText = isActive
    ? gender
      ? getGenderedText(t.breathing.stop, gender)
      : t.breathing.stop.default
    : gender
    ? getGenderedText(t.breathing.start, gender)
    : t.breathing.start.default;

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
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        {/* Top section */}
        <View style={{ marginTop: 20 }}>
          <ProgressPills currentPhase={currentPhase} colors={colors} />
        </View>

        {/* Circle container with fixed height */}
        <View
          style={{
            height: maxCircleSize,
            width: maxCircleSize,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          <BreathingCircle
            scale={circleScale}
            opacity={circleOpacity}
            size={baseCircleSize}
            colors={colors}
            phaseText={getPhaseText(currentPhase)}
            timeLeft={timeLeft}
            isActive={isActive}
            isRTL={isRTL}
          />
        </View>

        {/* Bottom section */}
        <View
          style={{
            width: "100%",
            alignItems: "center",
            marginTop: "auto",
            paddingBottom: Math.max(20, insets.bottom + 10),
          }}
        >
          <Stats
            sessionCount={sessionCount}
            colors={colors}
            isGuided={isGuideVisible}
            onGuidePress={() => setIsGuideVisible(true)}
            currentPattern={currentPattern}
            onPatternPress={() => setIsPatternModalVisible(true)}
          />

          <CustomButton
            title={buttonText}
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
              marginTop: 20,
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
              />
            }
            iconPosition={isRTL ? "right" : "left"}
            variant={isActive ? "secondary" : "primary"}
            isRTL={isRTL}
          />
        </View>

        <BreathingGuideModal
          visible={isGuideVisible}
          onClose={() => setIsGuideVisible(false)}
          colors={colors}
          isRTL={isRTL}
          currentPattern={currentPattern}
        />

        <PatternSelectionModal
          visible={isPatternModalVisible}
          onClose={() => setIsPatternModalVisible(false)}
          onSelect={handlePatternChange}
          currentPattern={currentPattern}
          colors={colors}
          isRTL={isRTL}
        />
      </View>
    </View>
  );
};

export default BreathingScreen;
