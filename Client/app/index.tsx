import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, Dimensions, Animated, ViewToken, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { theme } from '@/styles/Theme';
import { auth } from '@/services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '@/components/Loader';
import { AuthRoutingService } from '@/services/authRoutingService';
import { translations } from '@/constants/translations';
import { useNotification } from '@/context/NotificationContext';
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get("window");

interface OnboardingItem {
  id: string;
  titleKey: keyof typeof translations.en.translation.onboarding;
  descriptionKey: keyof typeof translations.en.translation.onboarding;
  image: any;
}

// Updated onboardingData with proper types
const onboardingData: OnboardingItem[] = [
  {
    id: "1",
    titleKey: "welcome",
    descriptionKey: "welcome",
    image: require("@/assets/images/welcome.png"),
  },
  {
    id: "2",
    titleKey: "support",
    descriptionKey: "support",
    image: require("@/assets/images/support.png"),
  },
  {
    id: "3",
    titleKey: "track",
    descriptionKey: "track",
    image: require("@/assets/images/track.png"),
  },
  {
    id: "4",
    titleKey: "connect",
    descriptionKey: "connect",
    image: require("@/assets/images/connect.png"),
  },
];

export default function Index() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const { theme: currentTheme } = useTheme();
  const { isRTL, t } = useLanguage();

  const colors = theme[currentTheme];
  const { notification, expoPushToken, error } = useNotification();
  const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]) {
      setCurrentIndex(Number(viewableItems[0].index));
    }
  }).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;



  
  // Authentication check effect
  useEffect(() => {

    let isSubscribed = true;

    const checkAuth = async () => {
      try {
        // Check AsyncStorage first to avoid unnecessary auth checks
        const existingToken = await AsyncStorage.getItem("userToken");

        if (!isSubscribed) return;

        if (existingToken && auth.currentUser) {
          await AuthRoutingService.handleAuthRouting();
          return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (!isSubscribed) return;

          try {
            if (user) {
              const newToken = await user.getIdToken();
              await AsyncStorage.setItem("userToken", newToken);
              await AuthRoutingService.handleAuthRouting();
            } else {
              await AsyncStorage.removeItem("userToken");
              setIsCheckingAuth(false);
            }
          } catch (error) {
            console.error("Auth state change error:", error);
            if (isSubscribed) {
              await AsyncStorage.removeItem("userToken");
              setIsCheckingAuth(false);
            }
          }
        });

        return () => {
          unsubscribe();
          isSubscribed = false;
        };
      } catch (error) {
        console.error("Initial auth check error:", error);
        if (isSubscribed) {
          setIsCheckingAuth(false);
        }
      }
    };

    checkAuth();
  }, []);

  // Push notification token effect
  useEffect(() => {
    const sendPushTokenToServer = async () => {
      if (!expoPushToken) return;
      
      try {
        await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/save-push-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: expoPushToken }),
        });
      } catch (error) {
        console.error('Error sending push token:', error);
      }
    };
  
    sendPushTokenToServer();
  }, [expoPushToken]);


  const scrollTo = (index: number) => {
    slidesRef.current?.scrollToIndex({ index });
  };

  const Paginator = () => {
    const { isRTL } = useLanguage();
    const dots = [...onboardingData];
    if (isRTL) dots.reverse();

    return (
      <View style={styles.paginatorContainer}>
        {dots.map((_, index) => {
          const adjustedIndex = isRTL ? dots.length - 1 - index : index;
          const inputRange = [
            (adjustedIndex - 1) * width,
            adjustedIndex * width,
            (adjustedIndex + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderItem = ({ item }: { item: OnboardingItem }) => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <ThemedText
          variant="primary"
          className="text-2xl font-pbold text-center mb-4"
        >
          {t.onboarding[item.titleKey].title}
        </ThemedText>
        <ThemedText
          variant="secondary"
          className="text-lg font-pregular text-center px-8 leading-7"
          isRTL={isRTL}
        >
          {t.onboarding[item.titleKey].description}
        </ThemedText>
      </View>
    </View>
  );

  if (isCheckingAuth) {
    return <Loader isLoading={true} />;
  }

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
          inverted={isRTL}
        />

        <View style={styles.bottomContainer}>
          <Paginator />

          <View style={styles.buttonContainer}>
            <CustomButton
              title={
                currentIndex === onboardingData.length - 1
                  ? t.common.getStarted
                  : t.common.next
              }
              handlePress={() => {
                if (currentIndex < onboardingData.length - 1) {
                  scrollTo(currentIndex + 1);
                } else {
                  router.push("/(auth)/sign-in");
                }
              }}
              containerStyles={{ width: "100%", marginBottom: 16 }}
              variant="primary"
              textStyles="text-lg"
            />

            {currentIndex < onboardingData.length - 1 && (
              <CustomButton
                title={t.common.skip}
                handlePress={() => router.push("/(auth)/sign-in")}
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
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  paginatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
  },
});
