import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { theme } from '@/styles/Theme';
import { RoleSelectionProps } from '@/types/onboarding';
import { Ionicons } from '@expo/vector-icons';

export const RoleSelectionSection: React.FC<RoleSelectionProps> = ({
  userType,
  setUserType,
}) => {
  const { theme: currentTheme } = useTheme();
  const { t, isRTL } = useLanguage();
  const colors = theme[currentTheme];
  const windowWidth = Dimensions.get('window').width;

  return (
    <View className="space-y-8">
      <Text 
        style={{ 
          color: colors.text,
          textAlign: isRTL ? 'right' : 'left',
        }} 
        className="text-xl font-pbold"
      >
        {t.roleSelection.title}
      </Text>

      {/* Patient Option */}
      <TouchableOpacity
        onPress={() => setUserType('patient')}
        className={`p-6 mb-4 mt-4 rounded-xl border-2 ${userType === 'patient' ? 'border-primary' : 'border-border'}`}
        style={{
          backgroundColor: colors.surface,
          borderColor: userType === 'patient' ? colors.primary : colors.border,
        }}
      >
        <View className="flex-row items-center justify-between mb-4" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          <View className="flex-row items-center" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <Ionicons 
              name="person" 
              size={24} 
              color={userType === 'patient' ? colors.primary : colors.text} 
            />
            <Text 
              style={{ 
                color: userType === 'patient' ? colors.primary : colors.text,
                marginLeft: isRTL ? 0 : 12,
                marginRight: isRTL ? 12 : 0,
              }}
              className="text-lg font-pbold"
            >
              {t.roleSelection.patientTitle}
            </Text>
          </View>
          {userType === 'patient' && (
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
          )}
        </View>
        <Text 
          style={{ 
            color: colors.textSecondary,
            textAlign: isRTL ? 'right' : 'left',
          }} 
          className="font-pregular"
        >
          {t.roleSelection.patientDescription}
        </Text>
      </TouchableOpacity>

      {/* Therapist Option */}
      <TouchableOpacity
        onPress={() => setUserType('therapist')}
        className={`p-6 rounded-xl border-2`}
        style={{
          backgroundColor: colors.surface,
          borderColor: userType === 'therapist' ? colors.primary : colors.border,
        }}
      >
        <View className="flex-row items-center justify-between mb-4" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          <View className="flex-row items-center" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            <Ionicons 
              name="medical" 
              size={24} 
              color={userType === 'therapist' ? colors.primary : colors.text} 
            />
            <Text 
              style={{ 
                color: userType === 'therapist' ? colors.primary : colors.text,
                marginLeft: isRTL ? 0 : 12,
                marginRight: isRTL ? 12 : 0,
              }}
              className="text-lg font-pbold"
            >
              {t.roleSelection.therapistTitle}
            </Text>
          </View>
          {userType === 'therapist' && (
            <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
          )}
        </View>
        <Text 
          style={{ 
            color: colors.textSecondary,
            textAlign: isRTL ? 'right' : 'left',
          }} 
          className="font-pregular"
        >
          {t.roleSelection.therapistDescription}
        </Text>
      </TouchableOpacity>
    </View>
  );
};