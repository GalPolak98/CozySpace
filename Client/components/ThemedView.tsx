import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/styles/Theme';

interface ThemedViewProps extends ViewProps {
  variant?: 'default' | 'surface' | 'primary';
  className?: string;
}

const ThemedView: React.FC<ThemedViewProps> = ({ 
  children, 
  variant = 'default',
  className = '',
  style,
  ...props 
}) => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  const getBackgroundColor = () => {
    switch (variant) {
      case 'surface':
        return colors.surface;
      case 'primary':
        return colors.primary;
      default:
        return colors.background;
    }
  };

  return (
    <View
      className={className}
      style={[{ backgroundColor: getBackgroundColor() }, style]}
      {...props}
    >
      {children}
    </View>
  );
};

export default ThemedView;