import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  Platform,
} from "react-native";
import { Audio } from "expo-av";
import { useTheme } from "@/components/ThemeContext";
import { theme } from "@/styles/Theme";
import { Ionicons } from "@expo/vector-icons";
import { musicData, MusicTrack } from "@/types/musicData";
import { usePathname } from "expo-router";

interface MusicPlayerProps {
  selectedCategory: string;
  onTrackSelect?: (trackId: string) => void;
  showSelectedTrack?: boolean;
  selectedTrackId?: string | null;
}

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
  selectedTrackId: initialSelectedTrackId = null,
}) => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(
    initialSelectedTrackId
  );
  const [isLoading, setIsLoading] = useState(false);
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const pathname = usePathname();

  const categoryMusic = musicData.filter(
    (track) => track.category === selectedCategory
  );

  const stopSound = async () => {
    if (soundRef.current) {
      try {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        }
      } catch (error) {
        console.error("Error checking sound status:", error);
      } finally {
        soundRef.current = null;
        setIsPlaying(null);
      }
    }
  };

  // Initialize audio
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
      stopSound();
    };
  }, []);

  // Handle tab changes
  useEffect(() => {
    if (!pathname.includes("profile")) {
      stopSound();
    }
  }, [pathname]);

  // Handle category changes
  useEffect(() => {
    stopSound();
  }, [selectedCategory]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleTrackPress = async (trackItem: MusicTrack) => {
    try {
      setIsLoading(true);

      if (showSelectedTrack) {
        setSelectedTrackId(trackItem.id);
        onTrackSelect?.(trackItem.id);
      }

      // Stop current sound if playing
      await stopSound();

      // If we're clicking the same track that was playing, just stop it
      if (isPlaying === trackItem.id) {
        setIsPlaying(null);
        return;
      }

      const audioFile = trackItem.audioFile;
      if (!audioFile) {
        console.error(
          `Audio file not found for filename: ${trackItem.filename}`
        );
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
      console.error("Playback error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createShadowStyle = (color: string): ViewStyle => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  });

  return (
    <View className="space-y-2">
      {categoryMusic.map((track) => (
        <TouchableOpacity
          key={track.id}
          onPress={() => handleTrackPress(track)}
          style={{
            ...createShadowStyle(colors.textSecondary),
            backgroundColor:
              isPlaying === track.id || selectedTrackId === track.id
                ? `${colors.primary}1A`
                : colors.surface,
          }}
          className={`flex-row items-center justify-between p-4 mt-2 rounded-xl`}
          disabled={isLoading}
        >
          <View className="flex-row items-center space-x-3">
            <Ionicons
              name={isPlaying === track.id ? "pause-circle" : "play-circle"}
              size={24}
              className="p-1"
              color={
                isPlaying === track.id || selectedTrackId === track.id
                  ? colors.primary
                  : colors.text
              }
            />
            <View>
              <Text
                style={{
                  color:
                    isPlaying === track.id || selectedTrackId === track.id
                      ? colors.primary
                      : colors.text,
                }}
                className="font-pmedium text-base"
              >
                {track.title}
              </Text>
              <Text style={{ color: colors.textSecondary }} className="text-sm">
                {formatDuration(track.duration)}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center space-x-2">
            {isLoading &&
              (isPlaying === track.id || selectedTrackId === track.id) && (
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
