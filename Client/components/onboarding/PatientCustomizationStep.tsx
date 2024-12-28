import React from "react";
import { View, Text } from "react-native";
import { FeatureOption } from "./FeatureOption";
import { MusicSelectionSection } from "./MusicSelectionSection";
import { useTheme } from "@/components/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { theme } from "@/styles/Theme";

interface PatientCustomizationStepProps {
  useSmartJewelry: boolean;
  setUseSmartJewelry: (value: boolean) => void;
  enableVibrations: boolean;
  setEnableVibrations: (value: boolean) => void;
  playMusic: boolean;
  setPlayMusic: (value: boolean) => void;
  selectedMusic: string | null;
  setSelectedMusic: (value: string) => void;
  selectedTrack: string | null;
  setSelectedTrack: (value: string | null) => void;
}

export const PatientCustomizationStep: React.FC<
  PatientCustomizationStepProps
> = ({
  useSmartJewelry,
  setUseSmartJewelry,
  enableVibrations,
  setEnableVibrations,
  playMusic,
  setPlayMusic,
  selectedMusic,
  setSelectedMusic,
  selectedTrack,
  setSelectedTrack,
}) => {
  const { theme: currentTheme } = useTheme();
  const { t, isRTL } = useLanguage();
  const colors = theme[currentTheme];

  return (
    <View className="space-y-6">
      {/* Smart Jewelry Section */}
      <View className="bg-surface p-4 space-y-4">
        <Text
          style={{
            color: colors.text,
            textAlign: isRTL ? "right" : "left",
          }}
          className="text-lg font-pbold"
        >
          {t.customization.smartJewelryTitle}
        </Text>

        <FeatureOption
          title={t.customization.enableJewelry}
          description={t.customization.jewelryDescription}
          isEnabled={useSmartJewelry}
          onToggle={() => {
            if (useSmartJewelry === true) {
              setEnableVibrations(false);
            }
            setUseSmartJewelry(!useSmartJewelry);
          }}
          iconName={useSmartJewelry ? "bluetooth" : "bluetooth-outline"}
          isRTL={isRTL}
        />

        {useSmartJewelry && (
          <FeatureOption
            title={t.customization.vibrationAlerts}
            description={t.customization.vibrationDescription}
            isEnabled={enableVibrations}
            onToggle={() => setEnableVibrations(!enableVibrations)}
            iconName={enableVibrations ? "pulse" : "pulse-outline"}
            isRTL={isRTL}
          />
        )}
      </View>

      {/* Music Therapy Section */}
      <View className="bg-surface p-4 space-y-4">
        <Text
          style={{
            color: colors.text,
            textAlign: isRTL ? "right" : "left",
          }}
          className="text-lg font-pbold"
        >
          {t.customization.musicTherapyTitle}
        </Text>

        <FeatureOption
          title={t.customization.enableMusic}
          description={t.customization.musicDescription}
          isEnabled={playMusic}
          onToggle={() => {
            setPlayMusic(!playMusic);
            if (!playMusic) {
              setSelectedMusic("");
              setSelectedTrack(null);
            }
          }}
          iconName={playMusic ? "musical-notes" : "musical-notes-outline"}
          isRTL={isRTL}
        />

        {playMusic && (
          <View className="space-y-4 mt-4">
            <MusicSelectionSection
              selectedMusic={selectedMusic}
              setSelectedMusic={(category) => {
                setSelectedMusic(category);
              }}
              selectedTrack={selectedTrack}
              setSelectedTrack={setSelectedTrack}
              isRTL={isRTL}
            />
          </View>
        )}
      </View>
    </View>
  );
};
