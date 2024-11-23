import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import { CustomDropdown } from '@/components/CustomDropdown';
import { TherapistSelectionProps, OptionType } from '@/types/onboarding';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import ENV from '@/env';

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
  const [therapists, setTherapists] = useState<OptionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const url = `${ENV.EXPO_PUBLIC_SERVER_URL}/api/therapists`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();
        if (!data.therapists) {
          throw new Error('No therapists data in response');
        }

        // Add "No therapist" option at the beginning
        const therapistsWithNone = [
          { id: 'none', label: 'I don\'t want to work with a therapist now', sublabel: 'You can select a therapist later' },
          ...data.therapists
        ];
        
        setTherapists(therapistsWithNone);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load therapists');
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  // Reset data sharing options when "No therapist" is selected
  useEffect(() => {
    if (selectedTherapist === 'none') {
      setDataShareOptions({
        anxietyTracking: false,
        personalDocumentation: false
      });
    }
  }, [selectedTherapist, setDataShareOptions]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="p-4 bg-error/10 rounded-lg">
        <Text style={{ color: colors.error }} className="text-center">
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View className="space-y-6">
      <CustomDropdown
        label="Select Your Therapist"
        options={therapists}
        value={selectedTherapist}
        onChange={(id) => setSelectedTherapist(id)}
        placeholder="Choose a therapist to work with"
      />

      {selectedTherapist && selectedTherapist !== 'none' && (
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
      )}
    </View>
  );
};