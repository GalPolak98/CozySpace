export type PhaseType = "inhale" | "holdIn" | "exhale" | "holdOut";

export interface BreathingPhase {
  text: string;
  duration: number;
}

// Define specific phase structures for each pattern
interface BoxBreathingPhases {
  inhale: BreathingPhase;
  holdIn: BreathingPhase;
  exhale: BreathingPhase;
  holdOut: BreathingPhase;
}

interface RelaxingBreathPhases {
  inhale: BreathingPhase;
  holdIn: BreathingPhase;
  exhale: BreathingPhase;
}

interface BaseBreathingPattern {
  name: string;
  inhale: number;
  holdIn: number;
  exhale: number;
  musicPath: any;
}

interface BoxBreathingPattern extends BaseBreathingPattern {
  type: "4-4-4-4";
  holdOut: number;
  phases: BoxBreathingPhases;
}

interface RelaxingBreathPattern extends BaseBreathingPattern {
  type: "4-7-8";
  holdOut: 0;
  phases: RelaxingBreathPhases;
}

export type BreathingPattern = BoxBreathingPattern | RelaxingBreathPattern;
export type BreathingPatternType = BreathingPattern["type"];

export const BREATHING_PATTERNS: Record<BreathingPatternType, BreathingPattern> = {
  "4-4-4-4": {
    type: "4-4-4-4",
    name: "Box Breathing",
    inhale: 4000,
    holdIn: 4000,
    exhale: 4000,
    holdOut: 4000,
    phases: {
      inhale: {
        text: "Inhale",
        duration: 4,
      },
      holdIn: {
        text: "Hold",
        duration: 4,
      },
      exhale: {
        text: "Exhale",
        duration: 4,
      },
      holdOut: {
        text: "Hold",
        duration: 4,
      },
    },
    musicPath: require("@/assets/music/Mindfulness_Meditation_Breathing_Exercise_4_4_4_4.mp3"),
  },
  "4-7-8": {
    type: "4-7-8",
    name: "Relaxing Breath",
    inhale: 4000,
    holdIn: 7000,
    exhale: 8000,
    holdOut: 0,
    phases: {
      inhale: {
        text: "Inhale",
        duration: 4,
      },
      holdIn: {
        text: "Hold",
        duration: 7,
      },
      exhale: {
        text: "Exhale",
        duration: 8,
      },
    },
    musicPath: require("@/assets/music/Mindfulness_Meditation_Breathing_Exercise_4_7_8.mp3"),
  },
} as const;

