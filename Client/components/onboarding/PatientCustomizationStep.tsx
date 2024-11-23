import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { FeatureOption } from './FeatureOption';
import { MusicSelectionSection } from './MusicSelectionSection';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import { MusicPlayer } from '../MusicPlayer';

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

export const PatientCustomizationStep: React.FC<PatientCustomizationStepProps> = ({
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
  const colors = theme[currentTheme];

  const handleMusicToggle = (value: boolean) => {
    setPlayMusic(value);
    if (!value) {
      setSelectedMusic('');
      setSelectedTrack(null);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedMusic(category);
    setSelectedTrack(null); // Reset track selection when category changes
  };

  return (
    <View className="space-y-6">
      {/* Smart Jewelry Section */}
      <View className="bg-surface p-4 rounded-xl space-y-4">
        <Text style={{ color: colors.text }} className="text-lg font-pbold">
          Smart Jewelry Integration
        </Text>

        <FeatureOption
          title="Enable Smart Jewelry"
          description="Connect your AnxiEase smart jewelry"
          isEnabled={useSmartJewelry}
          onToggle={() => setUseSmartJewelry(!useSmartJewelry)}
          iconName={useSmartJewelry ? 'bluetooth' : 'bluetooth-outline'}
        />

        {useSmartJewelry && (
          <FeatureOption
            title="Anxiety Alert Vibrations"
            description="Receive gentle vibrations during detected high anxiety moments"
            isEnabled={enableVibrations}
            onToggle={() => setEnableVibrations(!enableVibrations)}
            iconName={enableVibrations ? 'pulse' : 'pulse-outline'}
          />
        )}
      </View>

      {/* Music Therapy Section */}
      <View className="bg-surface p-4 rounded-xl space-y-4">
        <Text style={{ color: colors.text }} className="text-lg font-pbold">
          Music Therapy
        </Text>

        <FeatureOption
          title="Enable Music Therapy"
          description="Use calming music to help manage anxiety"
          isEnabled={playMusic}
          onToggle={() => {
            setPlayMusic(!playMusic);
            if (!playMusic) {
              setSelectedMusic('');
              setSelectedTrack(null);
            }
          }}
          iconName={playMusic ? 'musical-notes' : 'musical-notes-outline'}
        />

      {playMusic && (
        <View className="space-y-4">
          <MusicSelectionSection
            selectedMusic={selectedMusic}
            setSelectedMusic={category => {
              setSelectedMusic(category);
              setSelectedTrack(null);
            }}
            selectedTrack={selectedTrack}
            setSelectedTrack={setSelectedTrack}
          />
        </View>
      )}
      </View>
    </View>
  );
};