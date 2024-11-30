// src/components/reports/DateRangeSelector.tsx
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { format } from 'date-fns';
import { useTheme } from '@/components/ThemeContext';

interface DateRangeSelectorProps {
  dateRange: { startDate: Date; endDate: Date };
  onPress: () => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ dateRange, onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`
        flex-row items-center justify-between 
        p-2 rounded-lg
        ${theme === 'dark' ? 'bg-zinc-800 border border-zinc-700' : 'bg-blue-50 border border-blue-100'}
      `}
    >
      <View className="flex-row items-center">
        <View className="mr-2">
          <Text className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-blue-600'}`}>
            Date Range
          </Text>
          <Text className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            {format(dateRange.startDate, 'MM/dd/yyyy')} - {format(dateRange.endDate, 'MM/dd/yyyy')}
          </Text>
        </View>
      </View>
      <View className="bg-blue-500 px-3 py-1.5 rounded-full">
        <Text className="text-white text-xs">Change</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DateRangeSelector;
