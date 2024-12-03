import React, { useState, useEffect, useMemo  } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Modal } from 'react-native';
import { format, subDays } from 'date-fns';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import StatCard from '@/components/reports/StatCard';
import Chart from '@/components/reports/Chart';
import DateRangeSelector from '@/components/reports/DateRangeSelector';
import DatePickerModal from '@/components/reports/DatePickerModal';
import config from '../../env';
import useAuth from '../../hooks/useAuth';
import { parse } from 'date-fns';

const mockDataService = {
  getReports: (startDate: Date, endDate: Date) => {
    return {
      averageAnxietyIntensity: '5.2',
      averageEpisodeDuration: '27m',
      notesCreated: '12',
      anxietyEvents: '36',
      weeklyData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          data: [7, 5, 8, 4, 6, 3, 5],
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, 
          strokeWidth: 2,
        }]
      }
    };
  }
};

const ReportsScreen = () => {
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 7),
    endDate: new Date()
  });

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);
  const [notesCount, setNotesCount] = useState<number>(0);
  const userId = useAuth()

  const reportData = useMemo(() => {
    return mockDataService.getReports(dateRange.startDate, dateRange.endDate);
  }, [dateRange]);


  const loadNotes = async () => {
    if (!userId) return;
  
    try {
      const response = await fetch(`${config.API_URL}/users/${userId}/latest`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) throw new Error('Failed to fetch notes');
  
      const fetchedNotes = (await response.json()).notes;
  
      console.log("Fetched Notes:", fetchedNotes);
  
      // Parse the notes' timestamps and filter them
      const filteredNotes = fetchedNotes.filter((note: { timestamp: string }) => {
        // Convert the timestamp string to a Date object using `date-fns`
        const noteDate = parse(note.timestamp.split(', ')[0], 'dd.MM.yyyy', new Date());
        return (
          noteDate >= new Date(dateRange.startDate) &&
          noteDate <= new Date(dateRange.endDate)
        );
      });
  
      setNotesCount(filteredNotes.length);
    } catch (error) {
      console.error('Failed to fetch notes', error);
    }
  };
  
  

  // Trigger loading notes whenever the date range changes
  useEffect(() => {
    loadNotes();
  }, [dateRange]);

  const handleDayPress = (day: { dateString: string }) => {
    const selectedDate = new Date(day.dateString);

    if (isSelectingStartDate) {
      setDateRange(prev => ({
        ...prev,
        startDate: selectedDate
      }));
      setIsSelectingStartDate(false);
    } else {
      if (selectedDate >= dateRange.startDate) {
        setDateRange(prev => ({
          ...prev,
          endDate: selectedDate
        }));
        setDatePickerVisible(false);
        setIsSelectingStartDate(true);
      } else {
        alert('End date must be after start date');
      }
    }
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView className="flex-1">
        <View className="p-4">
          <DateRangeSelector
            dateRange={dateRange}
            onPress={() => {
              setDatePickerVisible(true);
              setIsSelectingStartDate(true);
            }}
          />

          <View className="flex-row justify-between mt-6">
            <StatCard
              title="Average Anxiety Intensity"
              value={reportData.averageAnxietyIntensity}
              icon="activity"
            />
            <StatCard
              title="Average Episode Duration"
              value={reportData.averageEpisodeDuration}
              icon="clock"
            />
          </View>

          <View className="flex-row justify-between mt-4">
            <StatCard
              title="Notes Created"
              value={notesCount.toString()}
              icon="file-text"
            />
            <StatCard
              title="Anxiety Events"
              value={reportData.anxietyEvents}
              icon="alert-circle"
            />
          </View>

          <Chart weeklyData={reportData.weeklyData} />
        </View>
      </ScrollView>

      <DatePickerModal
        isVisible={isDatePickerVisible}
        isSelectingStartDate={isSelectingStartDate}
        handleDayPress={handleDayPress}
        setVisible={setDatePickerVisible}
      />
    </ThemedView>
  );
};

export default ReportsScreen;
