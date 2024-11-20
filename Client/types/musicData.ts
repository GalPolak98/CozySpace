export interface MusicTrack {
  id: string;
  title: string;
  category: string;
  duration: number;
  filename: string;
  audioFile: any;
}

export const musicData: MusicTrack[] = [
  {
    id: "1",
    title: "Calming Nature Sounds",
    category: "nature",
    duration: 173,
    filename: "calm-nature.mp3",
    audioFile: require('@/assets/music/calm-nature.mp3')
  },
  {
    id: "2",
    title: "Deep Meditation",
    category: "meditation",
    duration: 240,
    filename: "calm-meditation.mp3",
    audioFile: require('@/assets/music/calm-meditation.mp3')
  },
  {
    id: "3",
    title: "Peaceful Piano",
    category: "classical",
    duration: 147,
    filename: "calm-piano-peaceful.mp3",
    audioFile: require('@/assets/music/calm-piano-peaceful.mp3')
  },
  {
    id: "4",
    title: "Insparation Piano",
    category: "classical",
    duration: 104,
    filename: "inspirational-calm-piano.mp3",
    audioFile: require('@/assets/music/inspirational-calm-piano.mp3')
  },
  {
    id: "5",
    title: "Ocean Waves",
    category: "nature",
    duration: 240,
    filename: "ocean-waves.mp3",
    audioFile: require('@/assets/music/ocean-waves.mp3')
  }
];