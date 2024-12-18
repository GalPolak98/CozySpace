import { Alert } from 'react-native';

interface Note {
  _id: string;
  content: string;
  date: string;  
  timestamp: string;
}

interface GuidedNote {
    anxietyRating: number;
    description: string;
    trigger: string;
    copingStrategies: string;
    physicalSymptoms: string;
    emotionalState: string;
    selfTalk: string;
    timestamp: string;
  }

const parseTimestamp = (timestamp: string, isRTL: boolean): number => {
  try {
    if (!timestamp) {
      console.warn('Invalid or empty timestamp:', timestamp);
      return 0; // Default or fallback timestamp
    }

    if (isRTL) {
      // Hebrew date format parsing: DD.MM.YYYY, HH:mm:ss
      const [datePart, timePart] = timestamp.split(', ');
      if (!datePart || !timePart) {
        console.warn('Invalid RTL timestamp format:', timestamp);
        return 0;
      }

      const [day, month, year] = datePart.split('.').map(Number);
      const [hours, minutes, seconds = 0] = timePart.split(':').map(Number); // Default seconds to 0
      if (
        isNaN(day) || isNaN(month) || isNaN(year) ||
        isNaN(hours) || isNaN(minutes) || isNaN(seconds)
      ) {
        console.warn('Invalid date or time parts in RTL timestamp:', timestamp);
        return 0;
      }

      // Return timestamp in milliseconds
      return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
    } else {
      // English date format parsing
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        console.warn('Invalid English timestamp format:', timestamp);
        return 0;
      }

      return date.getTime();
    }
  } catch (error) {
    console.error('Error parsing timestamp:', error, 'Input:', timestamp);
    return 0;
  }
};


export const loadNotes = async (
  userId: string | null, 
  isRTL: boolean,
  t: { common: { error: string }, note: { fetchError: string } }
): Promise<Note[]> => {
  if (!userId) return [];
  
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/${userId}/latest`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Failed to fetch notes');

    const fetchedNotes = (await response.json()).notes;
    console.log("fetched notes:", fetchedNotes)
    const sortedNotes = Array.isArray(fetchedNotes)
      ? fetchedNotes.sort((a, b) => parseTimestamp(b.timestamp, isRTL) - parseTimestamp(a.timestamp, isRTL))
      : [fetchedNotes];

    return sortedNotes;
  } catch (error) {
    console.error('Failed to fetch notes!!', error);
    Alert.alert(t.common.error, t.note.fetchError);
    return [];
  }
};

export const loadGuidedNotes = async (
    userId: string | null, 
    isRTL: boolean,
    t: { common: { error: string }, note: { fetchError: string } }
  ): Promise<GuidedNote[]> => {
    if (!userId) return [];
    
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/users/${userId}/guidedNotes`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) throw new Error('Failed to fetch notes');
  
      const fetchedNotes = (await response.json()).notes;
      console.log(fetchedNotes)
      return fetchedNotes;
    } catch (error) {
      console.error('Failed to fetch notes', error);
      Alert.alert(t.common.error, t.note.fetchError);
      return [];
    }
  };