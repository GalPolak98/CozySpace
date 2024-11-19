import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import { MusicSelectionProps } from '@/types/onboarding';
import { Ionicons } from '@expo/vector-icons';

const MUSIC_CATEGORIES = [
  { id: '1', name: 'Calming Nature Sounds', icon: 'leaf' as const },
  { id: '2', name: 'Meditation Music', icon: 'musical-notes' as const },
  { id: '3', name: 'Classical', icon: 'musical-note' as const },
  { id: '4', name: 'White Noise', icon: 'waves' as const },
  { id: '5', name: 'Piano', icon: 'musical-notes' as const },
] as const;

export const MusicSelectionSection: React.FC<MusicSelectionProps> = ({
  selectedMusic,
  setSelectedMusic
}) => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  const renderMusicItem = ({ item }: { item: typeof MUSIC_CATEGORIES[number] }) => (
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
        size={32}
        color={selectedMusic === item.id ? colors.primary : colors.text}
      />
      <Text
        style={{ color: selectedMusic === item.id ? colors.primary : colors.text }}
        className="text-center mt-2 font-pmedium"
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="space-y-4">
      <Text style={{ color: colors.text }} className="font-pmedium text-lg mb-2">
        Select Preferred Music Type
      </Text>
      <FlatList
        data={MUSIC_CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderMusicItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};