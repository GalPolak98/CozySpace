import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useTheme } from "@/components/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { theme } from "@/styles/Theme";
import { Ionicons } from "@expo/vector-icons";
import { MusicPlayer } from "../MusicPlayer";
import { musicData } from "@/types/musicData";

const MUSIC_CATEGORIES = [
  { id: "nature", nameKey: "natureSounds", icon: "leaf" as const },
  { id: "meditation", nameKey: "meditation", icon: "musical-notes" as const },
  { id: "classical", nameKey: "classical", icon: "musical-note" as const },
] as const;

interface MusicSelectionProps {
  selectedMusic: string | null;
  setSelectedMusic: (id: string) => void;
  selectedTrack: string | null;
  setSelectedTrack: (id: string | null) => void;
  isRTL?: boolean;
}

export const MusicSelectionSection: React.FC<MusicSelectionProps> = ({
  selectedMusic,
  setSelectedMusic,
  selectedTrack,
  setSelectedTrack,
  isRTL = false,
}) => {
  const { theme: currentTheme } = useTheme();
  const { t } = useLanguage();
  const colors = theme[currentTheme];

  const renderMusicItem = ({
    item,
  }: {
    item: (typeof MUSIC_CATEGORIES)[number];
  }) => {
    const tracksInCategory = musicData.filter(
      (track) => track.category === item.id
    ).length;

    return (
      <TouchableOpacity
        onPress={() => setSelectedMusic(item.id)}
        className={`p-4 rounded-xl w-32 h-32 items-center justify-center mb-2`}
        style={{
          borderWidth: selectedMusic === item.id ? 2 : 1,
          borderColor:
            selectedMusic === item.id ? colors.primary : colors.border,
          backgroundColor: colors.surface,
          marginRight: isRTL ? 0 : 8,
          marginLeft: isRTL ? 8 : 0,
          alignItems: "center",
          width: "auto",
        }}
      >
        <Ionicons
          name={item.icon}
          size={32}
          color={selectedMusic === item.id ? colors.primary : colors.text}
        />
        <Text
          style={{
            color: selectedMusic === item.id ? colors.primary : colors.text,
            textAlign: "center",
          }}
          className="mt-2 font-pmedium"
        >
          {t.music.categories[item.nameKey]}
        </Text>
        <Text
          style={{
            color: colors.textSecondary,
            textAlign: "center",
          }}
          className="text-xs mt-1"
        >
          {t.music.tracksCount.replace("{count}", tracksInCategory.toString())}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="space-y-4">
      <Text
        style={{
          color: colors.text,
          textAlign: isRTL ? "right" : "left",
        }}
        className="text-base font-pmedium mb-3"
      >
        {t.music.selectType}
      </Text>
      <FlatList
        data={MUSIC_CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderMusicItem}
        keyExtractor={(item) => item.id}
        style={{ flexDirection: isRTL ? "row-reverse" : "row" }}
        scrollEnabled={true}
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
