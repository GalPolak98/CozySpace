import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import { Ionicons } from '@expo/vector-icons';
import { MusicPlayer } from '../MusicPlayer';
import { musicData } from '@/types/musicData';

const MUSIC_CATEGORIES = [
  { id: 'nature', name: 'Nature Sounds', icon: 'leaf' as const },
  { id: 'meditation', name: 'Meditation', icon: 'musical-notes' as const },
  { id: 'classical', name: 'Classical', icon: 'musical-note' as const },
] as const;

interface MusicSelectionProps {
  selectedMusic: string | null;
  setSelectedMusic: (id: string) => void;
  selectedTrack: string | null;
  setSelectedTrack: (id: string | null) => void;
}

export const MusicSelectionSection: React.FC<MusicSelectionProps> = ({
  selectedMusic,
  setSelectedMusic,
  selectedTrack,
  setSelectedTrack
}) => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  const renderMusicItem = ({ item }: { item: typeof MUSIC_CATEGORIES[number] }) => {
    const tracksInCategory = musicData.filter(track => track.category === item.id).length;

    return (
      <TouchableOpacity
        onPress={() => setSelectedMusic(item.id)}
        className={`mr-4 p-4 rounded-xl w-32 h-32 items-center justify-center ${
          selectedMusic === item.id ? 'border-2' : 'border'
        }`}
        style={{
          borderColor: selectedMusic === item.id ? colors.primary : colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <Ionicons
          name={item.icon}
          size={32}
          color={selectedMusic === item.id ? colors.primary : colors.text}
        />
        <Text
          style={{ color: selectedMusic === item.id ? colors.primary : colors.text }}
          className="text-center mt-2 font-pmedium"
        >
          {item.name}
        </Text>
        <Text
          style={{ color: colors.textSecondary }}
          className="text-xs mt-1"
        >
          {tracksInCategory} tracks
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="space-y-4">
      <Text style={{ color: colors.text }} className="font-pmedium text-lg mt-4 mb-1">
        Select Music Type
      </Text>
      <FlatList
        data={MUSIC_CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderMusicItem}
        keyExtractor={item => item.id}
      />
      {selectedMusic && (
        <MusicPlayer
          selectedCategory={selectedMusic}
          onTrackSelect={setSelectedTrack}
          showSelectedTrack={true}
          selectedTrackId={selectedTrack}
        />
      )}
    </View>
  );
};