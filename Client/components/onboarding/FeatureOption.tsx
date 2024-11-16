import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import { CustomCheckbox } from '@/components/CustomCheckbox';

interface FeatureOptionProps {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
}

export const FeatureOption: React.FC<FeatureOptionProps> = ({
  title,
  description,
  isEnabled,
  onToggle,
  iconName,
}) => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  return (
    <TouchableOpacity
      onPress={onToggle}
      className="bg-surface rounded-xl overflow-hidden"
      style={{
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View className="p-4 border-l-4" style={{ borderColor: isEnabled ? colors.primary : 'transparent' }}>
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1">
            <Text style={{ color: colors.text }} className="text-lg font-pbold mb-1">
              {title}
            </Text>
            <Text style={{ color: colors.textSecondary }} className="text-sm font-pregular">
              {description}
            </Text>
          </View>
          <Ionicons 
            name={iconName}
            size={24}
            color={isEnabled ? colors.primary : colors.text}
            style={{ marginLeft: 12 }}
          />
        </View>
        
        <View className="flex-row items-center mt-2">
          <CustomCheckbox
            checked={isEnabled}
            onCheckedChange={onToggle}
            size="medium"
          />
          <Text 
            style={{ color: isEnabled ? colors.primary : colors.text }} 
            className="ml-3 font-pmedium"
          >
            {isEnabled ? 'Enabled' : 'Enable'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};