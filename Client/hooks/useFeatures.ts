// hooks/useFeatures.ts
import { useState, useEffect } from 'react';
import { featuresService } from '@/services/featuresService';
import { IFeatures } from '@/types/features';

export const useFeatures = () => {
  const [features, setFeatures] = useState<IFeatures | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await featuresService.getFeatures();
        setFeatures(response);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  return { features, error, isLoading };
};