export interface DassResponse {
    userId: string;
    timestamp: string;
    answers: Array<{
      questionId: number;
      score: number;
    }>;
    totalScore: number;
    analysis?: DassAnalysis;
  }
  
  export interface DassAnalysis {
    scaleScores: ScaleScores;
    severity: ScaleSeverity;
  }
  
  export interface ScaleScores {
    depression: number;
    anxiety: number;
    stress: number;
  }
  
  export interface ScaleSeverity {
    depression: string;
    anxiety: string;
    stress: string;
  }
  
  // Question mappings to scales
  export const SCALE_MAPPINGS = {
    depression: [3, 5, 10, 13, 16, 17, 21],
    anxiety: [2, 4, 7, 9, 15, 19, 20],
    stress: [1, 6, 8, 11, 12, 14, 18]
  };
  
  // Severity thresholds for each scale
  export const SEVERITY_THRESHOLDS = {
    depression: {
      normal: [0, 4],
      mild: [5, 6],
      moderate: [7, 10],
      severe: [11, 13],
      extremelySevere: [14, Number.MAX_VALUE]
    },
    anxiety: {
      normal: [0, 3],
      mild: [4, 5],
      moderate: [6, 7],
      severe: [8, 9],
      extremelySevere: [10, Number.MAX_VALUE]
    },
    stress: {
      normal: [0, 7],
      mild: [8, 9],
      moderate: [10, 12],
      severe: [13, 16],
      extremelySevere: [17, Number.MAX_VALUE]
    }
  };