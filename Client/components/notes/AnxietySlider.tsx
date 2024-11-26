import React from 'react';
import Slider from "@react-native-community/slider";
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';

interface AnxietySliderProps {
  anxietyRating: number;
  setAnxietyRating: (rating: number) => void;
}

const AnxietySlider: React.FC<AnxietySliderProps> = ({ anxietyRating, setAnxietyRating }) => {
  const { theme: currentTheme } = useTheme();
  const { t, isRTL } = useLanguage();

  const getColorForRating = (rating: number) => {
    if (rating <= 3) return '#4CAF50';  // Green
    if (rating <= 7) return '#FFC107';  // Yellow
    return '#FF5252';  // Red
  };

  const getLabelText = (rating: number) => {
    if (rating <= 3) return t.anxiety.lowAnxiety;
    if (rating <= 7) return t.anxiety.moderateAnxiety;
    return t.anxiety.highAnxiety;
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
        { 
          color: currentTheme === 'dark' ? '#FFFFFF' : '#333333',
          textAlign: isRTL ? 'right' : 'left' 
        }
      ]}>
        {t.anxiety.ratingQuestion}
      </ThemedText>
      
      <View style={[styles.colorBandsContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={[styles.colorBand, { backgroundColor: '#4CAF50' }]} />
        <View style={[styles.colorBand, { backgroundColor: '#FFC107' }]} />
        <View style={[styles.colorBand, { backgroundColor: '#FF5252' }]} />
      </View>
      
      <View style={[styles.scaleContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <ThemedText style={[styles.scaleText, { color: currentTheme === 'dark' ? '#888' : '#666' }]}>
          0
        </ThemedText>
        <ThemedText style={[styles.scaleText, { color: currentTheme === 'dark' ? '#888' : '#666' }]}>5</ThemedText>
        <ThemedText style={[styles.scaleText, { color: currentTheme === 'dark' ? '#888' : '#666' }]}>
          10
        </ThemedText>
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
        style={[styles.slider, { transform: [{ scaleX: isRTL ? -1 : 1 }] }]}
      />

      <View style={[styles.resultContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <ThemedText style={[
          styles.rating,
          { 
            color: getColorForRating(anxietyRating),
            marginRight: isRTL ? 0 : 12,
            marginLeft: isRTL ? 12 : 0
          }
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