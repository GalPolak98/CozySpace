import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  Animated,
  ViewToken,
  Image,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';

const { width, height } = Dimensions.get('window');

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  image: any;
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'Welcome to AnxiEase',
    description: 'Your personal companion for managing anxiety and finding peace in daily life.',
    image: require('../assets/images/welcome.png'),
  },
  {
    id: '2',
    title: 'Real-Time Support',
    description: 'Get immediate assistance during anxiety moments with guided breathing exercises and calming techniques.',
    image: require('../assets/images/support.png'),
  },
  {
    id: '3',
    title: 'Track Your Journey',
    description: 'Monitor your progress and identify patterns to better understand and manage your anxiety triggers.',
    image: require('../assets/images/track.png'),
  },
  {
    id: '4',
    title: 'Connect with Care',
    description: 'Safely share your progress with your therapist and build a stronger support system.',
    image: require('../assets/images/connect.png'),
  },
];

export default function Index() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]) {
      setCurrentIndex(Number(viewableItems[0].index));
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = (index: number) => {
    if (slidesRef.current) {
      slidesRef.current.scrollToIndex({ index });
    }
  };

  const Paginator = () => {
    return (
      <View style={styles.paginatorContainer}>
        {onboardingData.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[styles.dot, {
                width: dotWidth,
                opacity,
                backgroundColor: colors.primary,
              }]}
            />
          );
        })}
      </View>
    );
  };

  const renderItem = ({ item }: { item: OnboardingItem }) => {
    return (
      <View style={[styles.slide, { width }]}>
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.textContainer}>
          <ThemedText
            variant="primary"
            className="text-3xl font-pbold text-center mb-4"
          >
            {item.title}
          </ThemedText>
          <ThemedText
            variant="secondary"
            className="text-lg font-pregular text-center px-8 leading-7"
          >
            {item.description}
          </ThemedText>
        </View>
      </View>
    );
  };

  return (
    <ThemedView className="flex-1">
      <View className="flex-1">
        <FlatList
          data={onboardingData}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
          scrollEventThrottle={32}
          className="flex-1"
        />
        
        <View style={styles.bottomContainer}>
          <Paginator />
          
          <View style={styles.buttonContainer}>
            <CustomButton
              title={currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
              handlePress={() => {
                if (currentIndex < onboardingData.length - 1) {
                  scrollTo(currentIndex + 1);
                } else {
                  router.push('/(auth)/sign-in');
                }
              }}
              containerStyles="w-full mb-4"
              variant="primary"
              textStyles="text-lg"
            />
            
            {currentIndex < onboardingData.length - 1 && (
              <CustomButton
                title="Skip"
                handlePress={() => router.push('/(auth)/sign-in')}
                variant="secondary"
                containerStyles="w-full"
                textStyles="text-base"
              />
            )}
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  paginatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  bottomContainer: {
    paddingBottom: height * 0.08,
  },
  buttonContainer: {
    paddingHorizontal: 24,
  }
});