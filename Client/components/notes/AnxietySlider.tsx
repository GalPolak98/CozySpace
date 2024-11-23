import React from 'react';
import Slider from "@react-native-community/slider";
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';

interface AnxietySliderProps {
  anxietyRating: number;
  setAnxietyRating: (rating: number) => void;
}

const AnxietySlider: React.FC<AnxietySliderProps> = ({ anxietyRating, setAnxietyRating }) => {
  const { theme: currentTheme } = useTheme();

  const getColorForRating = (rating: number) => {
    if (rating <= 3) return '#4CAF50';  // Green
    if (rating <= 7) return '#FFC107';  // Yellow
    return '#FF5252';  // Red
  };

  const getLabelText = (rating: number) => {
    if (rating <= 3) return 'Low Anxiety';
    if (rating <= 7) return 'Moderate Anxiety';
    return 'High Anxiety';
  };

  return (
    <ThemedView style={[
      styles.section,
      { 
        backgroundColor: currentTheme === 'dark' ? '#1E1E1E' : '#FFFFFF',
        borderColor: currentTheme === 'dark' ? '#333333' : '#E0E0E0',
      }
    ]}>
      <ThemedText style={[
        styles.label,
        { color: currentTheme === 'dark' ? '#FFFFFF' : '#333333' }
      ]}>
        How would you rate your current anxiety level?
      </ThemedText>
      
      {/* Color bands indicator */}
      <View style={styles.colorBandsContainer}>
        <View style={[styles.colorBand, { backgroundColor: '#4CAF50' }]} />
        <View style={[styles.colorBand, { backgroundColor: '#FFC107' }]} />
        <View style={[styles.colorBand, { backgroundColor: '#FF5252' }]} />
      </View>
      
      {/* Number scale */}
      <View style={styles.scaleContainer}>
        <ThemedText style={[styles.scaleText, { color: currentTheme === 'dark' ? '#888' : '#666' }]}>0</ThemedText>
        <ThemedText style={[styles.scaleText, { color: currentTheme === 'dark' ? '#888' : '#666' }]}>5</ThemedText>
        <ThemedText style={[styles.scaleText, { color: currentTheme === 'dark' ? '#888' : '#666' }]}>10</ThemedText>
      </View>

      <Slider
        minimumValue={0}
        maximumValue={10}
        value={anxietyRating}
        onValueChange={setAnxietyRating}
        step={1}
        minimumTrackTintColor={getColorForRating(anxietyRating)}
        maximumTrackTintColor={currentTheme === 'dark' ? '#444' : '#E0E0E0'}
        thumbTintColor={getColorForRating(anxietyRating)}
        style={styles.slider}
      />

      <View style={styles.resultContainer}>
        <ThemedText style={[
          styles.rating,
          { color: getColorForRating(anxietyRating) }
        ]}>
          {anxietyRating.toFixed(0)}
        </ThemedText>
        <ThemedText style={[
          styles.anxietyLabel,
          { color: currentTheme === 'dark' ? '#FFFFFF' : '#333333' }
        ]}>
          {getLabelText(anxietyRating)}
        </ThemedText>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginVertical: 16,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  colorBandsContainer: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8
  },
  colorBand: {
    flex: 1,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 16
  },
  scaleText: {
    fontSize: 12
  },
  slider: {
    width: '100%',
    height: 30,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rating: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 12
  },
  anxietyLabel: {
    fontSize: 16,
    fontWeight: '500'
  }
});

export default AnxietySlider;