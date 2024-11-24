import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/styles/Theme';

const AnimatedDots = () => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (dot: Animated.Value) => {
      return Animated.sequence([
        Animated.timing(dot, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        })
      ]);
    };

    const animation = Animated.loop(
      Animated.stagger(150, [
        createAnimation(dot1),
        createAnimation(dot2),
        createAnimation(dot3)
      ])
    );

    animation.start();

    return () => {
      animation.stop();
      dot1.setValue(0);
      dot2.setValue(0);
      dot3.setValue(0);
    };
  }, [dot1, dot2, dot3]);

  const createDotStyle = (animatedValue: Animated.Value) => ({
    transform: [{
      translateY: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -3] 
      })
    }]
  });

  return (
    <View style={styles.dots}>
      {[dot1, dot2, dot3].map((dot, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            { backgroundColor: colors.textSecondary },
            createDotStyle(dot)
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    height: 12,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 1,
    opacity: 0.7,
  },
});

export default AnimatedDots;