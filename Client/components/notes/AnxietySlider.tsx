import React from 'react';
import Slider from "@react-native-community/slider";
import { StyleSheet } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';

interface AnxietySliderProps {
  anxietyRating: number;
  setAnxietyRating: (rating: number) => void;
}

const AnxietySlider: React.FC<AnxietySliderProps> = ({ anxietyRating, setAnxietyRating }) => {
  const { theme: currentTheme } = useTheme();


  return (
    <ThemedView style={styles.section}>
        <ThemedText style={[styles.label, { color: currentTheme === 'dark' ? '#FFF' : '#333' }]}>
        How would you rate your current anxiety level?
      </ThemedText>
      <Slider
        minimumValue={0}
        maximumValue={10}
        value={anxietyRating}
        onValueChange={setAnxietyRating}
        step={1}
      />
      <ThemedText style={[styles.rating, { color: currentTheme === 'dark' ? '#FFF' : '#0B72B8' }]}>
        {anxietyRating.toFixed(0)}
      </ThemedText>
      </ThemedView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 10,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow position
    shadowOpacity: 0.2, // Shadow transparency
    shadowRadius: 6, // Shadow blur
    elevation: 5
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
      
  },
});

export default AnxietySlider;
