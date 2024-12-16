import { useState, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { PhaseType, BREATHING_PATTERNS, BreathingPatternType } from '@/types/breathing';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

export const useBreathingAnimation = (
  isActive: boolean, 
  currentPattern: BreathingPatternType,
  sound?: Audio.Sound
) => {
  const [currentPhase, setCurrentPhase] = useState<PhaseType>("inhale");
  const [timeLeft, setTimeLeft] = useState<number>(
    BREATHING_PATTERNS[currentPattern].phases.inhale.duration
  );
  
  const circleScale = useRef(new Animated.Value(1)).current;
  const circleOpacity = useRef(new Animated.Value(0.6)).current;
  
  const phaseTimerRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<Animated.CompositeAnimation>();
  const cycleCountRef = useRef<number>(0);
  const isSoundPlayingRef = useRef<boolean>(false);

  const resetAnimation = () => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = undefined;
    }
    
    circleScale.setValue(1);
    circleOpacity.setValue(0.6);
    
    setCurrentPhase("inhale");
    setTimeLeft(BREATHING_PATTERNS[currentPattern].phases.inhale.duration);
    cycleCountRef.current = 0;
    isSoundPlayingRef.current = false;
  };

  const checkSoundStatus = async (sound: Audio.Sound) => {
    try {
      const status = await sound.getStatusAsync();
      return status.isLoaded;
    } catch {
      return false;
    }
  };

  const restartSound = async () => {
    if (!sound || isSoundPlayingRef.current) return;
    
    try {
      isSoundPlayingRef.current = true;
      
      const isLoaded = await checkSoundStatus(sound);
      if (isLoaded) {
        await sound.stopAsync();
        await sound.setPositionAsync(0);
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Error restarting sound:', error);
    } finally {
      isSoundPlayingRef.current = false;
    }
  };

  const createPhaseAnimation = (phase: PhaseType) => {
    const pattern = BREATHING_PATTERNS[currentPattern];
    const duration = {
      inhale: pattern.inhale,
      holdIn: pattern.holdIn,
      exhale: pattern.exhale,
      holdOut: pattern.holdOut,
    }[phase] || 0;

    const config = {
      inhale: {
        scale: 1.5,
        opacity: 1,
        easing: Easing.inOut(Easing.cubic),
      },
      holdIn: {
        scale: 1.5,
        opacity: 1,
        easing: Easing.linear,
      },
      exhale: {
        scale: 1,
        opacity: 0.6,
        easing: Easing.inOut(Easing.cubic),
      },
      holdOut: {
        scale: 1,
        opacity: 0.6,
        easing: Easing.linear,
      },
    }[phase];

    return Animated.parallel([
      Animated.timing(circleScale, {
        toValue: config.scale,
        duration: duration,
        easing: config.easing,
        useNativeDriver: true,
      }),
      Animated.timing(circleOpacity, {
        toValue: config.opacity,
        duration: duration,
        easing: config.easing,
        useNativeDriver: true,
      }),
    ]);
  };

  useEffect(() => {
    if (!isActive) {
      clearInterval(phaseTimerRef.current);
      resetAnimation();
      return;
    }

    const pattern = BREATHING_PATTERNS[currentPattern];
    const totalCycleDuration = pattern.inhale + pattern.holdIn + pattern.exhale + 
      (currentPattern === "4-7-8" ? 0 : pattern.holdOut);
    let currentTime = 0;

    // Start with sound
    restartSound();

    const updatePhaseAndTime = () => {
      phaseTimerRef.current = setInterval(() => {
        currentTime = (currentTime + 1000) % totalCycleDuration;

        // Check if we're starting a new cycle
        if (currentTime === 0) {
          cycleCountRef.current += 1;
          setTimeout(() => {
            restartSound();
          }, 100);
        }

        if (currentTime < pattern.inhale) {
          setCurrentPhase("inhale");
          setTimeLeft(Math.ceil((pattern.inhale - currentTime) / 1000));
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (currentTime < pattern.inhale + pattern.holdIn) {
          setCurrentPhase("holdIn");
          setTimeLeft(Math.ceil((pattern.inhale + pattern.holdIn - currentTime) / 1000));
        } else if (currentTime < pattern.inhale + pattern.holdIn + pattern.exhale) {
          setCurrentPhase("exhale");
          setTimeLeft(Math.ceil((pattern.inhale + pattern.holdIn + pattern.exhale - currentTime) / 1000));
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (currentPattern !== "4-7-8") {
          setCurrentPhase("holdOut");
          setTimeLeft(Math.ceil((totalCycleDuration - currentTime) / 1000));
        }
      }, 1000);
    };

    const startBreathingAnimation = () => {
      const runPhase = (phase: PhaseType) => {
        if (!isActive) return;

        if (currentPattern === "4-7-8" && phase === "holdOut") {
          runPhase("inhale");
          return;
        }
        
        animationRef.current = createPhaseAnimation(phase);
        animationRef.current.start(({ finished }) => {
          if (finished && isActive) {
            const nextPhase = {
              inhale: "holdIn",
              holdIn: "exhale",
              exhale: currentPattern === "4-4-4-4" ? "holdOut" : "inhale",
              holdOut: "inhale",
            }[phase] as PhaseType;
            
            if (nextPhase === "inhale" && phase !== "holdOut") {
              cycleCountRef.current += 1;
              setTimeout(() => {
                restartSound();
              }, 50);
            }
            
            runPhase(nextPhase);
          }
        });
      };

      runPhase("inhale");
    };

    startBreathingAnimation();
    updatePhaseAndTime();

    return () => {
      clearInterval(phaseTimerRef.current);
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = undefined;
      }
    };
  }, [isActive, currentPattern]);

  return {
    currentPhase,
    timeLeft,
    circleScale,
    circleOpacity,
    cycleCount: cycleCountRef.current,
  };
};