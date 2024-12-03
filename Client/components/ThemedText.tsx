import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/styles/Theme';

interface ThemedTextProps extends TextProps {
  variant?: 'default' | 'secondary' | 'primary' | 'error';
  className?: string;
  isRTL?: boolean;
}

const ThemedText: React.FC<ThemedTextProps> = ({ 
  children, 
  variant = 'default',
  className = '',
  style,
  isRTL,
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
      style={[
        { 
          color: getColor(),
          ...(isRTL !== undefined && {
            textAlign: isRTL ? 'right' : 'left',
            writingDirection: isRTL ? 'rtl' : 'ltr',
          }),     
        }, 
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default ThemedText;