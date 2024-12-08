import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { theme } from '@/styles/Theme';
import { CustomDropdown } from '@/components/CustomDropdown';
import { TherapistSelectionProps, OptionType } from '@/types/onboarding';
import { CustomCheckbox } from '@/components/CustomCheckbox';

const DATA_SHARING_OPTIONS = [
  {
    id: 'anxietyTracking',
    labelKey: 'anxietyTrackingLabel',
    descriptionKey: 'anxietyTrackingDesc'
  },
  {
    id: 'personalDocumentation',
    labelKey: 'personalDocLabel',
    descriptionKey: 'personalDocDesc'
  }
] as const;

export const TherapistSelectionSection: React.FC<TherapistSelectionProps> = ({
  selectedTherapist,
  setSelectedTherapist,
  dataShareOptions,
  setDataShareOptions
}) => {
  const { theme: currentTheme } = useTheme();
  const { t, isRTL } = useLanguage();
  const colors = theme[currentTheme];
  const [therapists, setTherapists] = useState<OptionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const url = `${process.env.EXPO_PUBLIC_SERVER_URL}/api/therapists`;
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
          throw new Error(t.therapistSelection.noTherapistsError);
        }

        const therapistsWithNone = [
          { 
            id: 'none', 
            label: t.therapistSelection.noTherapistOption, 
            sublabel: t.therapistSelection.noTherapistDesc 
          },
          ...data.therapists
        ];
        
        setTherapists(therapistsWithNone);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : t.therapistSelection.loadError);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, [t]);

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
        <Text style={{ color: colors.error, textAlign: isRTL ? 'right' : 'left' }} className="text-center">
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View className="space-y-6">
      <CustomDropdown
        label={t.therapistSelection.dropdownLabel}
        options={therapists}
        value={selectedTherapist}
        onChange={(id) => setSelectedTherapist(id)}
        placeholder={t.therapistSelection.dropdownPlaceholder}
        isRTL={isRTL}
      />

      {selectedTherapist && selectedTherapist !== 'none' && (
        <View className="bg-surface p-6 rounded-xl">
          <Text 
            style={{ 
              color: colors.text,
              textAlign: isRTL ? 'right' : 'left' 
            }} 
            className="text-lg font-pbold mb-4"
          >
            {t.therapistSelection.dataSharingTitle}
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
                style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
              >
                <View style={{ marginRight: isRTL ? 0 : 16, marginLeft: isRTL ? 16 : 0}}>
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
                  <Text 
                    style={{ 
                      color: colors.text,
                      textAlign: isRTL ? 'right' : 'left' 
                    }} 
                    className="font-pmedium text-base"
                  >
                    {t.therapistSelection[option.labelKey]}
                  </Text>
                  <Text 
                    style={{ 
                      color: colors.textSecondary,
                      textAlign: isRTL ? 'right' : 'left',
                      marginBottom:12 
                    }} 
                    className="text-sm mt-1"
                  >
                    {t.therapistSelection[option.descriptionKey]}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mt-4 p-4 bg-primary/10 rounded-lg">
            <Text 
              style={{ 
                color: colors.text,
                textAlign: isRTL ? 'right' : 'left' 
              }} 
              className="text-sm font-pregular"
            >
              {t.therapistSelection.privacyNotice}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};