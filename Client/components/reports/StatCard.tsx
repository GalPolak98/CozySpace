import React from 'react';
import { View } from 'react-native';
import ThemedView from '../ThemedView';
import ThemedText from '../ThemedText';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { useLanguage } from '@/context/LanguageContext';  

interface StatCardProps {
  title: string;
  value: string;
  icon: keyof typeof Feather.glyphMap;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon,
}) => {
  const { theme } = useTheme(); 
  const { t,isRTL,getGenderedText } = useLanguage();  


  return (
    <ThemedView className={`p-2 rounded-lg w-[49%] mb-4 shadow-md`}>
      <ThemedView className={`flex-row items-center mb-3 ${isRTL ? 'right' : 'left'}`}>
      <ThemedView className={`p-2 rounded-full`}>
          <Feather name={icon} size={20} color="#3b82f6" />
        </ThemedView>
        <ThemedView className="ml-4">
          <ThemedText className={`font-pbold text-lg mb-0.5`}>{value}</ThemedText>
          <ThemedText className={`font-pmedium text-xs mb-0.5`}>{title}</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );



};

export default StatCard;
