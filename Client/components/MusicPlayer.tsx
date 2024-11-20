import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import { Ionicons } from '@expo/vector-icons';
import { musicData, MusicTrack } from '@/types/musicData';

interface MusicPlayerProps {
  selectedCategory: string;
  onTrackSelect?: (trackId: string) => void;
  showSelectedTrack?: boolean;
  selectedTrackId?: string | null;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  selectedCategory,
  onTrackSelect,
  showSelectedTrack = false,
  selectedTrackId: initialSelectedTrackId = null
}) => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(initialSelectedTrackId);
  const [isLoading, setIsLoading] = useState(false);
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  // Filter music by category
  const categoryMusic = musicData.filter(track => track.category === selectedCategory);

  useEffect(() => {
    const initAudio = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    };
    initAudio();

    return () => {
      const cleanup = async () => {
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
          setIsPlaying(null);
        }
      };
      cleanup();
    };
  }, []);

  useEffect(() => {
    const cleanup = async () => {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setIsPlaying(null);
      }
    };
    cleanup();
  }, [selectedCategory]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTrackPress = async (trackItem: MusicTrack) => {
    try {
      setIsLoading(true);

      if (showSelectedTrack) {
        setSelectedTrackId(trackItem.id);
        onTrackSelect?.(trackItem.id);
      }

      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      if (isPlaying === trackItem.id) {
        setIsPlaying(null);
        return;
      }

      const audioFile = trackItem.audioFile;
      if (!audioFile) {
        console.error(`Audio file not found for filename: ${trackItem.filename}`);
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        audioFile,
        { shouldPlay: true },
        (status: any) => {
          if (status.didJustFinish) {
            setIsPlaying(null);
          }
        }
      );

      soundRef.current = newSound;
      setIsPlaying(trackItem.id);
    } catch (error) {
      console.error('Playback error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="space-y-2">
      {categoryMusic.map((track) => (
        <TouchableOpacity
          key={track.id}
          onPress={() => handleTrackPress(track)}
          style={{
            backgroundColor: isPlaying === track.id || selectedTrackId === track.id 
              ? `${colors.primary}1A` 
              : colors.surface
          }}
          className={`flex-row items-center justify-between p-4 mt-2 rounded-xl`}
          disabled={isLoading}
        >
          <View className="flex-row items-center space-x-3">
            <Ionicons
              name={isPlaying === track.id ? 'pause-circle' : 'play-circle'}
              size={24}
              className='p-1'
              color={isPlaying === track.id || selectedTrackId === track.id ? colors.primary : colors.text}
            />
            <View>
              <Text
                style={{ 
                  color: isPlaying === track.id || selectedTrackId === track.id 
                    ? colors.primary 
                    : colors.text 
                }}
                className="font-pmedium text-base"
              >
                {track.title}
              </Text>
              <Text
                style={{ color: colors.textSecondary }}
                className="text-sm"
              >
                {formatDuration(track.duration)}
              </Text>
            </View>
          </View>
          
          <View className="flex-row items-center space-x-2">
            {isLoading && (isPlaying === track.id || selectedTrackId === track.id) && (
              <ActivityIndicator size="small" color={colors.primary} />
            )}
            {showSelectedTrack && selectedTrackId === track.id && (
              <Ionicons 
                name="checkmark-circle" 
                size={24} 
                color={colors.primary} 
              />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};