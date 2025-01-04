import React, { useState, useEffect, useMemo } from "react";
import { ScrollView, View, TouchableOpacity, Modal } from "react-native";
import { format, subDays, parse, eachDayOfInterval } from "date-fns";
import ThemedView from "@/components/ThemedView";
import StatCard from "@/components/reports/StatCard";
import Chart from "@/components/reports/Chart";
import DateRangeSelector from "@/components/reports/DateRangeSelector";
import DatePickerModal from "@/components/reports/DatePickerModal";
import useAuth from "../../hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import { loadNotes, loadGuidedNotes } from "../../utils/notesUtils";
import { loadNotifications } from "../../utils/notificationsUtils";
import { useLocalSearchParams } from "expo-router";
import { userService } from "@/services/userService";
import { useUserData } from "@/hooks/useUserData";

const ReportsScreen = () => {
  const { t, isRTL, getGenderedText } = useLanguage();

  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 7),
    endDate: new Date(),
  });
  const { patientId } = useLocalSearchParams<{ patientId: string }>();

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);
  const [notesCount, setNotesCount] = useState<number>(0);
  const [notificationsCount, setNotifications] = useState<number>(0);
  const [averageEpisodeDuration, setAverageEpisodeDuration] =
    useState<number>(0);
  const [averageAnxietyIntensity, setAverageAnxietyIntensity] =
    useState<number>(0);
  const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const userId = useAuth();
  const { gender } = useUserData(userId);
  const [breathingSessionCount, setBreathingSessionCount] = useState<number>(0);
  const [averageBreathingSessionDuration, setAverageBreathingSessionDuration] =
    useState<number>(0);

  const generateDayLabels = (startDate: Date, endDate: Date) => {
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    return days.map((day) => {
      const dayName = format(day, "EEE"); // Get the abbreviated day name (e.g., Mon, Tue, etc.)
      return t.reports.days[dayName] || dayName; // Use the translation if available, fallback to the original day name
    });
  };

  const dayLabels = generateDayLabels(dateRange.startDate, dateRange.endDate);

  // console.log('startDate', dateRange.startDate , 'endDate', dateRange.endDate);

  const markedDates = useMemo(() => {
    const marked: {
      [key: string]: {
        selected: boolean;
        selectedColor: string;
        selectedTextColor: string;
      };
    } = {};
    const days = eachDayOfInterval({
      start: dateRange.startDate,
      end: dateRange.endDate,
    });
    days.forEach((day) => {
      marked[format(day, "yyyy-MM-dd")] = {
        selected: true,
        selectedColor: "#3B82F6",
        selectedTextColor: "white",
      };
    });
    return marked;
  }, [dateRange]);

  useEffect(() => {
    const fetchAndFilterNotes = async () => {
      try {
        const targetId = patientId || userId;

        // console.log('Fetching notes for user!!!!!!!!!:', targetId);
        const fetchedNotes = await loadNotes(
          targetId,
          isRTL,
          t as { common: { error: string }; note: { fetchError: string } }
        );
        // console.log('Fetched Notes:', fetchedNotes);
        // Filter notes based on dateRange
        const filteredNotes = fetchedNotes.filter((note) => {
          const noteDate = new Date(note.timestamp); // Parse the note's timestamp
          return (
            noteDate >= new Date(dateRange.startDate) &&
            noteDate <= new Date(dateRange.endDate)
          );
        });

        setNotesCount(filteredNotes.length); // Set count of filtered notes
        // console.log('Filtered Notes Count:', filteredNotes.length);
      } catch (error) {
        console.error("Failed to filter notes", error);
      }
    };

    fetchAndFilterNotes();
  }, [dateRange, userId]);

  useEffect(() => {
    const fetchGuidedNotes = async () => {
      try {
        const targetId = patientId || userId;

        const fetchedGuidedNotes = await loadGuidedNotes(
          targetId,
          isRTL,
          t as { common: { error: string }; note: { fetchError: string } }
        );

        const filteredNotes = fetchedGuidedNotes.filter((guidedNote) => {
          const noteDate = new Date(guidedNote.timestamp);
          const startDate = new Date(dateRange.startDate);
          const endDate = new Date(dateRange.endDate);
          endDate.setHours(23, 59, 59, 999); // Adjust endDate to the end of the day

          return noteDate >= startDate && noteDate <= endDate;
        });

        // console.log("Filtered Notes:", filteredNotes);

        if (filteredNotes.length > 0) {
          const totalAnxietyRating = filteredNotes.reduce(
            (sum, note) => sum + note.anxietyRating,
            0
          );
          const avgAnxietyIntensity = totalAnxietyRating / filteredNotes.length;
          setAverageAnxietyIntensity(avgAnxietyIntensity);

          // Initialize weekly data array based on the number of days in the date range
          let weeklyData = new Array(dayLabels.length).fill(0);

          // Aggregate anxiety ratings by each day in the range (not just by weekday)
          filteredNotes.forEach((note) => {
            const noteDate = new Date(note.timestamp);
            const dayIndex = eachDayOfInterval({
              start: dateRange.startDate,
              end: dateRange.endDate,
            }).findIndex(
              (day) =>
                format(day, "yyyy-MM-dd") === format(noteDate, "yyyy-MM-dd")
            );
            if (dayIndex !== -1) {
              weeklyData[dayIndex] += note.anxietyRating;
            }
          });

          // Calculate the average anxiety intensity for each day
          weeklyData = weeklyData.map((total, index) => {
            const count = filteredNotes.filter((note) => {
              const noteDate = new Date(note.timestamp);
              const dayIndex = eachDayOfInterval({
                start: dateRange.startDate,
                end: dateRange.endDate,
              }).findIndex(
                (day) =>
                  format(day, "yyyy-MM-dd") === format(noteDate, "yyyy-MM-dd")
              );
              return dayIndex === index;
            }).length;
            return count > 0 ? total / count : 0;
          });

          setWeeklyData(weeklyData);
          // console.log("Weekly Data after aggregation:", weeklyData);
        } else {
          // Reset data if no notes match
          console.log("No notes match the date range");
          setAverageAnxietyIntensity(0);
          setWeeklyData(new Array(dayLabels.length).fill(0));
        }
      } catch (error) {
        console.error("Failed to fetch guided notes", error);
      }
    };

    fetchGuidedNotes();
  }, [dateRange, userId]);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const targetId = patientId || userId;
        const fetchedNotifications = await loadNotifications(
          targetId,
          isRTL,
          t as {
            common: { error: string };
            notifications: { fetchError: string };
          }
        );

        if (Array.isArray(fetchedNotifications)) {
          const notificationsCount = fetchedNotifications.length;

          setNotifications(notificationsCount);

          if (notificationsCount > 0) {
            const totalAnxietyDuration = fetchedNotifications.reduce(
              (sum, notification) => {
                return sum + notification.anxietyDuration;
              },
              0
            );
            const averageEpisodeDuration =
              totalAnxietyDuration / notificationsCount;
            setAverageEpisodeDuration(averageEpisodeDuration);
          } else {
            setAverageEpisodeDuration(0);
          }
        } else {
          console.error(
            "Fetched notifications is not an array:",
            fetchedNotifications
          );
          setNotifications(0); // Invalid data, set count to 0
          setAverageEpisodeDuration(0); // If no valid notifications, set average duration to 0
        }
      } catch (error) {
        console.error("Failed to filter notifications:", error);
        setNotifications(0); // On error, set count to 0
        setAverageEpisodeDuration(0); // On error, set average duration to 0
      }
    };

    // Fetch notifications whenever dateRange or userId changes
    fetchNotification();
  }, [dateRange, userId]);

  useEffect(() => {
    const fetchBreathingSessions = async () => {
      try {
        const targetId = patientId || userId;
        if (!targetId) {
          return;
        }
        const response = await userService.getBreathingSession(targetId);

        // Calculate the total number of sessions
        setBreathingSessionCount(response.length);

        if (response.length > 0) {
          const totalBreathingSession = response.reduce(
            (sum: number, session: { durationSec: number }) =>
              sum + session.durationSec,
            0
          );
          const avgBreathingSession = totalBreathingSession / response.length;
          setAverageBreathingSessionDuration(avgBreathingSession);
        } else {
          // Reset data if no notes match
          console.log("No breathung sessions match the date range!");
          setAverageBreathingSessionDuration(0);
        }
      } catch (error) {
        // console.log('Failed to fetch breathing sessions', error);
      }
    };

    fetchBreathingSessions();
  }, [dateRange, userId]);

  const handleDayPress = (day: { dateString: string }) => {
    const selectedDate = new Date(day.dateString);

    if (isSelectingStartDate) {
      setDateRange((prev) => ({
        ...prev,
        startDate: selectedDate,
      }));
      setIsSelectingStartDate(false);
    } else {
      if (selectedDate >= dateRange.startDate) {
        setDateRange((prev) => ({
          ...prev,
          endDate: selectedDate,
        }));
        setDatePickerVisible(false);
        setIsSelectingStartDate(true);
      } else {
        alert("End date must be after start date");
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
              value={averageEpisodeDuration.toFixed(1)}
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
              value={notificationsCount.toString()}
              icon="alert-circle"
            />
          </View>

          <View className="flex-row justify-between mt-2">
            <StatCard
              title={t.reports.breathingSessions}
              value={breathingSessionCount.toString()}
              icon="airplay"
            />
            <StatCard
              title={t.reports.averageBreathingSessionDuration}
              value={averageBreathingSessionDuration.toFixed(1)}
              icon="clock"
            />
          </View>
          <Chart
            weeklyData={{
              labels: dayLabels,
              datasets: [
                {
                  data: weeklyData,
                  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            }}
          />
        </View>
      </ScrollView>

      <DatePickerModal
        isVisible={isDatePickerVisible}
        isSelectingStartDate={isSelectingStartDate}
        handleDayPress={handleDayPress}
        setVisible={setDatePickerVisible}
        markedDates={markedDates}
      />
    </ThemedView>
  );
};

export default ReportsScreen;
