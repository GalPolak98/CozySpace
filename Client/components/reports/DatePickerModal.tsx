// src/components/reports/DatePickerModal.tsx
import React from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';  

interface DatePickerModalProps {
  isVisible: boolean;
  isSelectingStartDate: boolean;
  handleDayPress: (day: { dateString: string }) => void;
  setVisible: (visible: boolean) => void;
  markedDates: { [key: string]: any }; // Prop for marked dates

}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isVisible,
  isSelectingStartDate,
  handleDayPress,
  setVisible,
  markedDates,  // Accept markedDates as prop

}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();  // Get translation function

  // Define calendar styles based on the theme
  const calendarStyles = {
    todayTextColor: theme === 'dark' ? 'white' : 'black',
    selectedDayBackgroundColor: theme === 'dark' ? '#4B89FF' : '#3B82F6',
    monthTextColor: theme === 'dark' ? 'white' : 'black',
    backgroundColor: theme === 'dark' ? '#1E1E1E' : 'white',
    calendarBackground: theme === 'dark' ? '#1E1E1E' : 'white',
    dayTextColor: theme === 'dark' ? 'white' : 'black',
    textDisabledColor: theme === 'dark' ? '#666' : '#ccc',
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View className={`flex-1 justify-center items-center ${theme === 'dark' ? 'bg-black/70' : 'bg-black/50'}`}>
        <View className={`w-11/12 rounded-lg p-4 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-white'}`}>
          <Text className={`text-center mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            {isSelectingStartDate ? t.reports.selectStartDate : 'Select End Date'}
          </Text>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={markedDates}  // Pass markedDates to the calendar
            theme={{
              ...calendarStyles,
              textSectionTitleColor: theme === 'dark' ? 'white' : 'black',
              selectedDayBackgroundColor: calendarStyles.selectedDayBackgroundColor,
            }}
          />
          <TouchableOpacity onPress={() => setVisible(false)} className="mt-4 bg-red-500 p-3 rounded">
            <Text className="text-white text-center">{t.common.cancel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DatePickerModal;
