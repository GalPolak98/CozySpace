import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/styles/Theme';
import ThemedText from '@/components/ThemedText';

const TypingIndicator = () => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;
  
  useEffect(() => {
    const animateDot = (dot: Animated.Value) => {
      return Animated.sequence([
        Animated.timing(dot, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ]);
    };

    Animated.loop(
      Animated.stagger(200, [
        animateDot(dot1Opacity),
        animateDot(dot2Opacity),
        animateDot(dot3Opacity),
      ])
    ).start();

    return () => {
      dot1Opacity.setValue(0.3);
      dot2Opacity.setValue(0.3);
      dot3Opacity.setValue(0.3);
    };
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={[
        styles.container,
        { backgroundColor: colors.surface }
      ]}>
        <ThemedText style={[styles.text, { color: colors.textSecondary }]}>
          typing
        </ThemedText>
        <View style={styles.dotsContainer}>
          {[dot1Opacity, dot2Opacity, dot3Opacity].map((opacity, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                { 
                  backgroundColor: colors.textSecondary,
                  opacity 
                }
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  text: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginRight: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
});

export default TypingIndicator;