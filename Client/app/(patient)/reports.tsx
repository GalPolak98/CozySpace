import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, View, TouchableOpacity, Modal } from 'react-native';
import { format, subDays, parse } from 'date-fns';
import ThemedView from '@/components/ThemedView';
import StatCard from '@/components/reports/StatCard';
import Chart from '@/components/reports/Chart';
import DateRangeSelector from '@/components/reports/DateRangeSelector';
import DatePickerModal from '@/components/reports/DatePickerModal';
import config from '../../env';
import useAuth from '../../hooks/useAuth';
import { useLanguage } from '@/context/LanguageContext';  
import { loadNotes, loadGuidedNotes } from '../../utils/notesUtils';  // Adjust the import path as needed

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
  const { t,isRTL } = useLanguage();  // Get translation function

  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 7),
    endDate: new Date()
  });

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);
  const [notesCount, setNotesCount] = useState<number>(0);
  const [averageAnxietyIntensity, setAverageAnxietyIntensity] = useState<number>(0); 
  const userId = useAuth();

  const reportData = useMemo(() => {
    return mockDataService.getReports(dateRange.startDate, dateRange.endDate);
  }, [dateRange]);

  useEffect(() => {
    const fetchAndFilterNotes = async () => {
      if (!userId) return;
      
      try {
        const fetchedNotes = await loadNotes(userId, isRTL, t);
        
        const filteredNotes = fetchedNotes.filter((note) => {
          const noteDate = parse(note.timestamp.split(', ')[0], 'dd.MM.yyyy', new Date());
          return (
            noteDate >= new Date(dateRange.startDate) &&
            noteDate <= new Date(dateRange.endDate)
          );
        });
      
        setNotesCount(filteredNotes.length);
      } catch (error) {
        console.error('Failed to filter notes', error);
      }
    };
  
    fetchAndFilterNotes();
  }, [dateRange, userId]);

  useEffect(() => {
    const fetchGuidedNotes = async () => {
      if (!userId) return;
      
      try {
        const fetchedGuidedNotes = await loadGuidedNotes(userId, isRTL, t);

        // Filter notes based on dateRange
        const filteredNotes = fetchedGuidedNotes.filter((guidedNote) => {
          const noteDate = new Date(guidedNote.timestamp); // Use native JavaScript Date parsing
          console.log('Parsed Date:', noteDate); // Check if the date parsing works
          return (
            noteDate >= new Date(dateRange.startDate) &&
            noteDate <= new Date(dateRange.endDate)
          );
        });
        


        if (filteredNotes.length > 0) {
          const totalAnxietyRating = filteredNotes.reduce(
            (sum, note) => sum + note.anxietyRating,
            0
          );
          const avgAnxietyIntensity = totalAnxietyRating / filteredNotes.length;
          setAverageAnxietyIntensity(avgAnxietyIntensity);
          console.log(avgAnxietyIntensity)

        } else {
          setAverageAnxietyIntensity(0);  // If no notes are in the range, set to 0
        }
      } catch (error) {
        console.error('Failed to filter notes', error);
      }
    };
    fetchGuidedNotes();
  }, [dateRange, userId]);

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
              title={t.reports.averageAnxietyIntensity} 
              value={averageAnxietyIntensity.toFixed(1)} 
              icon="activity"
            />
            <StatCard
              title={t.reports.averageEpisodeDuration}
              value={reportData.averageEpisodeDuration}
              icon="clock"
            />
          </View>

          <View className="flex-row justify-between mt-4">
            <StatCard
              title={t.reports.notesCreated}
              value={notesCount.toString()}
              icon="file-text"
            />
            <StatCard
              title={t.reports.anxietyEvents}
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