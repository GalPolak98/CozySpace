import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';

export const useUserGender = (userId: string | null) => {
  const [gender, setGender] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchGender = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const userGender = await userService.getUserGender(userId);
        setGender(userGender);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch gender'));
      } finally {
        setLoading(false);
      }
    };

    fetchGender();
  }, [userId]);

  return { gender, loading, error };
};