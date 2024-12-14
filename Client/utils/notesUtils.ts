import { Alert } from 'react-native';

interface Note {
  _id: string;
  content: string;
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
  if (isRTL) {
    // Hebrew date format parsing
    const [datePart, timePart] = timestamp.split(', ');
    const [day, month, year] = datePart.split('.').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
  } else {
    // English date format parsing
    return new Date(timestamp).getTime();
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
    const sortedNotes = Array.isArray(fetchedNotes)
      ? fetchedNotes.sort((a, b) => parseTimestamp(b.timestamp, isRTL) - parseTimestamp(a.timestamp, isRTL))
      : [fetchedNotes];

    return sortedNotes;
  } catch (error) {
    console.error('Failed to fetch notes', error);
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