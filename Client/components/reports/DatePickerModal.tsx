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
  markedDates: { [key: string]: any };
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isVisible,
  isSelectingStartDate,
  handleDayPress,
  setVisible,
  dateRange
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();  

  const calendarStyles = {
    todayTextColor: theme === 'dark' ? 'white' : 'black',
    selectedDayBackgroundColor: theme === 'dark' ? '#4B89FF' : '#3B82F6',
    monthTextColor: theme === 'dark' ? 'white' : 'black',
    backgroundColor: theme === 'dark' ? '#1E1E1E' : 'white',
    calendarBackground: theme === 'dark' ? '#1E1E1E' : 'white',
    dayTextColor: theme === 'dark' ? 'white' : 'black',
    textDisabledColor: theme === 'dark' ? '#666' : '#ccc',
  };

  const getMarkedDates = () => {
    const marked: { [key: string]: any } = {};
    const startDateStr = dateRange.startDate.toISOString().split('T')[0];

    if (isSelectingStartDate) {
      if (startDateStr) {
        marked[startDateStr] = {
          selected: true,
          color: calendarStyles.selectedDayBackgroundColor,
          textColor: 'white'
        };
      }
      return marked;
    }

    const endDateStr = dateRange.endDate.toISOString().split('T')[0];
    
    if (startDateStr) {
      marked[startDateStr] = {
        selected: true,
        startingDay: true,
        color: calendarStyles.selectedDayBackgroundColor,
        textColor: 'white'
      };
    }

    if (endDateStr && !isSelectingStartDate) {
      marked[endDateStr] = {
        selected: true,
        endingDay: true,
        color: calendarStyles.selectedDayBackgroundColor,
        textColor: 'white'
      };

      const start = new Date(startDateStr);
      const end = new Date(endDateStr);
      const current = new Date(start);
      current.setDate(current.getDate() + 1);

      while (current < end) {
        const dateStr = current.toISOString().split('T')[0];
        marked[dateStr] = {
          selected: true,
          color: calendarStyles.selectedDayBackgroundColor,
          textColor: 'white'
        };
        current.setDate(current.getDate() + 1);
      }
    }

    return marked;
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View className={`flex-1 justify-center items-center ${theme === 'dark' ? 'bg-black/70' : 'bg-black/50'}`}>
        <View className={`w-11/12 rounded-lg p-4 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-white'}`}>
          <Text className={`text-center mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            {isSelectingStartDate ? t.reports.selectStartDate : t.reports.selectEndDate}
          </Text>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={getMarkedDates()}
            markingType="period"
            initialDate={dateRange.startDate.toISOString().split('T')[0]} 
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