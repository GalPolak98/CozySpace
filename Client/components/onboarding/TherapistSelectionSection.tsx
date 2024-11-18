import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import { CustomDropdown } from '@/components/CustomDropdown';
import { TherapistSelectionProps } from '@/types/onboarding';
import { CustomCheckbox } from '@/components/CustomCheckbox';

// Mock therapist data (replace with API data later)
const THERAPISTS = [
  { 
    id: '1', 
    label: 'Dr. Sarah Johnson',
    sublabel: 'Specializes in Anxiety & Depression • 10+ years experience'
  },
  { 
    id: '2', 
    label: 'Dr. Michael Chen',
    sublabel: 'Specializes in OCD & Anxiety • 8 years experience'
  },
  { 
    id: '3', 
    label: 'Dr. Emily Brown',
    sublabel: 'Specializes in Trauma & PTSD • 15 years experience'
  },
];

const DATA_SHARING_OPTIONS = [
  {
    id: 'anxietyTracking',
    label: 'Anxiety Tracking Reports',
    description: 'Share your anxiety levels, triggers, and monitoring data'
  },
  {
    id: 'personalDocumentation',
    label: 'Personal Documentation',
    description: 'Share your personal notes, progress, and therapy-related documents'
  }
] as const;

export const TherapistSelectionSection: React.FC<TherapistSelectionProps> = ({
  selectedTherapist,
  setSelectedTherapist,
  dataShareOptions,
  setDataShareOptions
}) => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  return (
    <View className="space-y-6">
      <CustomDropdown
        label="Select Your Therapist"
        options={THERAPISTS}
        value={selectedTherapist}
        onChange={(id) => setSelectedTherapist(id)}
        placeholder="Choose a therapist to work with"
      />

      <View className="bg-surface p-6 rounded-xl">
        <Text style={{ color: colors.text }} className="text-lg font-pbold mb-4">
          Data Sharing Settings
        </Text>

        <View className="space-y-5">
          {DATA_SHARING_OPTIONS.map((option) => (
            <TouchableOpacity 
              key={option.id} 
              onPress={() => {
                setDataShareOptions(prev => ({
                  ...prev,
                  [option.id]: !prev[option.id]
                }));
              }}
              className="flex-row items-start"
            >
              <View className="mr-4">
                <CustomCheckbox
                  checked={dataShareOptions[option.id]}
                  onCheckedChange={(checked) => {
                    setDataShareOptions(prev => ({
                      ...prev,
                      [option.id]: checked
                    }));
                  }}
                />
              </View>
              <View className="flex-1">
                <Text style={{ color: colors.text }} className="font-pmedium text-base">
                  {option.label}
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-sm mt-1">
                  {option.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-4 p-4 bg-primary/10 rounded-lg">
          <Text style={{ color: colors.text }} className="text-sm font-pregular">
            Your therapist will only see the data you choose to share. You can change these settings at any time.
          </Text>
        </View>
      </View>
    </View>
  );
};