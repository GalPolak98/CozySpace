import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

const useAudioRecordingPermission = () => {
  const [permissionResponse, setPermissionResponse] = useState<Audio.PermissionResponse | null>(null);

  const requestPermission = async () => {
    const response = await Audio.requestPermissionsAsync();
    setPermissionResponse(response);
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return { permissionResponse, requestPermission };
};

export default useAudioRecordingPermission;
