import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/styles/Theme';

interface CustomCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
  size = 'medium',
}) => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  const getSize = () => {
    switch (size) {
      case 'small': return { box: 20, icon: 14 };
      case 'large': return { box: 28, icon: 20 };
      default: return { box: 24, icon: 16 };
    }
  };

  const sizeConfig = getSize();
  const borderColor = checked ? colors.primary : (currentTheme === 'dark' ? '#FFFFFF' : '#000000');

  return (
    <TouchableOpacity
      onPress={() => !disabled && onCheckedChange(!checked)}
      disabled={disabled}
      style={{
        width: sizeConfig.box,
        height: sizeConfig.box,
        borderRadius: 6,
        borderWidth: 2,
        borderColor,
        backgroundColor: checked ? colors.primary : 'transparent',
        opacity: disabled ? 0.5 : 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      }}
    >
      {checked && (
        <Ionicons
          name="checkmark-sharp"
          size={sizeConfig.icon}
          color={colors.background}
          style={{ marginTop: 1 }}
        />
      )}
    </TouchableOpacity>
  );
};