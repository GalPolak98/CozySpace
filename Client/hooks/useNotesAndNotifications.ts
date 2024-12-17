import { useState, useEffect } from 'react';
import { loadNotes, loadGuidedNotes } from '../utils/notesUtils';
import { loadNotifications } from '../utils/notificationsUtils';

const useNotesAndNotifications = (userId, dateRange, isRTL, t) => {
  const [notesCount, setNotesCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [averageEpisodeDuration, setAverageEpisodeDuration] = useState(0);
  const [averageAnxietyIntensity, setAverageAnxietyIntensity] = useState(0);
  const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const fetchAndFilterNotes = async () => {
      if (!userId) return;
      try {
        const fetchedNotes = await loadNotes(userId, isRTL, t);
        const filteredNotes = fetchedNotes.filter((note) => {
          const noteDate = new Date(note.timestamp);
          return noteDate >= new Date(dateRange.startDate) && noteDate <= new Date(dateRange.endDate);
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
        const filteredNotes = fetchedGuidedNotes.filter((note) => {
          const noteDate = new Date(note.timestamp);
          return noteDate >= new Date(dateRange.startDate) && noteDate <= new Date(dateRange.endDate);
        });

        if (filteredNotes.length > 0) {
          const totalAnxietyRating = filteredNotes.reduce((sum, note) => sum + note.anxietyRating, 0);
          const avgAnxietyIntensity = totalAnxietyRating / filteredNotes.length;
          setAverageAnxietyIntensity(avgAnxietyIntensity);
        }
      } catch (error) {
        console.error('Failed to fetch guided notes', error);
      }
    };
    fetchGuidedNotes();
  }, [dateRange, userId]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) return;
      try {
        const fetchedNotifications = await loadNotifications(userId, isRTL, t);
        setNotificationsCount(fetchedNotifications.length);
        const totalAnxietyDuration = fetchedNotifications.reduce((sum, notification) => sum + notification.anxietyDuration, 0);
        setAverageEpisodeDuration(totalAnxietyDuration / fetchedNotifications.length);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };
    fetchNotifications();
  }, [dateRange, userId]);

  return { notesCount, notificationsCount, averageEpisodeDuration, averageAnxietyIntensity, weeklyData };
};

export default useNotesAndNotifications;
