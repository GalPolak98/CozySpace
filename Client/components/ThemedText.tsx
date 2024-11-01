import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';

interface ThemedTextProps extends TextProps {
  variant?: 'default' | 'secondary' | 'primary' | 'error';
  className?: string;
}

const ThemedText: React.FC<ThemedTextProps> = ({ 
  children, 
  variant = 'default',
  className = '',
  style,
  ...props 
}) => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  const getColor = () => {
    switch (variant) {
      case 'secondary':
        return colors.textSecondary;
      case 'primary':
        return colors.primary;
      case 'error':
        return colors.error;
      default:
        return colors.text;
    }
  };

  return (
    <Text
      className={className}
      style={[{ color: getColor() }, style]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default ThemedText;