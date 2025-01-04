import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { format } from 'date-fns';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';  

interface DateRangeSelectorProps {
  dateRange: { startDate: Date; endDate: Date };
  onPress: () => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ dateRange, onPress }) => {
  const { theme } = useTheme();
  const { t } = useLanguage();  

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
            {t.reports.dateRange}
          </Text>
          <Text className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          {format(dateRange.startDate, 'dd/MM/yyyy')} - {format(dateRange.endDate, 'dd/MM/yyyy')}
          </Text>
        </View>
      </View>
      <View className="bg-blue-500 px-3 py-1.5 rounded-full">
        <Text className="text-white text-xs"> {t.reports.change}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default DateRangeSelector;
