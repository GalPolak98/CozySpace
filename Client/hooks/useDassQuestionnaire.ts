import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '@/services/userService';
import { DassResponse } from '@/types/questionnaire';

const DASS_STORAGE_KEY = '@dass_last_shown_';
const MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000;

export const useDassQuestionnaire = (userId: string | null) => {
  const [shouldShow, setShouldShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const checkQuestionnaireTiming = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const lastShownStr = await AsyncStorage.getItem(DASS_STORAGE_KEY + userId);
        const lastShown = lastShownStr ? parseInt(lastShownStr) : null;
        const now = Date.now();
        
        if (!lastShown || (now - lastShown >= MONTH_IN_MS)) {
          setShouldShow(true);
        }
      } catch (error) {
        console.error('Error checking questionnaire timing:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkQuestionnaireTiming();
  }, [userId]);

  const submitResponse = async (response: DassResponse) => {
    if (!userId || hasSubmitted) return;
    
    try {
      setHasSubmitted(true);
      await userService.saveDassResponse(userId, response);
      await AsyncStorage.setItem(DASS_STORAGE_KEY + userId, Date.now().toString());
      setShouldShow(false);
    } catch (error) {
      setHasSubmitted(false);
      console.error('Error submitting DASS response:', error);
      throw error;
    }
  };

  const hideQuestionnaire = () => {
    setShouldShow(false);
  };

  return { 
    shouldShow, 
    isLoading, 
    submitResponse,
    hideQuestionnaire 
  };
};