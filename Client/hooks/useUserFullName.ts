import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';

export const useUserFullName = (userId: string | null) => {
  const [fullName, setFullName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFullName = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const profile = await userService.getUserProfile(userId);
        if (profile && profile.personalInfo) {
          const { firstName, lastName } = profile.personalInfo;
          setFullName(`${firstName} ${lastName}`);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user name'));
      } finally {
        setLoading(false);
      }
    };

    fetchFullName();
  }, [userId]);

  return { fullName, loading, error };
};