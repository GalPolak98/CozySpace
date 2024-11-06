import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

const useAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserId(user ? user.uid : null);
    });

    return () => unsubscribe();
  }, []);

  return userId;
};

export default useAuth;
