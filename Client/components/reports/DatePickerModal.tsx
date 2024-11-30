// src/components/reports/DatePickerModal.tsx
import React from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '@/components/ThemeContext';

interface DatePickerModalProps {
  isVisible: boolean;
  isSelectingStartDate: boolean;
  handleDayPress: (day: { dateString: string }) => void;
  setVisible: (visible: boolean) => void;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isVisible,
  isSelectingStartDate,
  handleDayPress,
  setVisible,
}) => {
  const { theme } = useTheme();

  // Define calendar styles based on the theme
  const calendarStyles = {
    todayTextColor: theme === 'dark' ? 'white' : 'black',
    selectedDayBackgroundColor: theme === 'dark' ? '#4B89FF' : '#3B82F6',
    selectedDayTextColor: 'white',
    arrowColor: theme === 'dark' ? 'white' : 'black',
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
            {isSelectingStartDate ? 'Select Start Date' : 'Select End Date'}
          </Text>
          <Calendar
            onDayPress={handleDayPress}
            theme={{
              ...calendarStyles,
              textSectionTitleColor: theme === 'dark' ? 'white' : 'black',
              selectedDayBackgroundColor: calendarStyles.selectedDayBackgroundColor,
              selectedDayTextColor: 'white',
            }}
          />
          <TouchableOpacity onPress={() => setVisible(false)} className="mt-4 bg-red-500 p-3 rounded">
            <Text className="text-white text-center">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DatePickerModal;
