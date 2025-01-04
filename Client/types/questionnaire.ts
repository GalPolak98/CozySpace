export interface DassQuestion {
    id: number;
    text: { male: string; female: string; default: string };
  }
  
  export interface DassResponse {
    userId: string;
    timestamp: string;
    answers: { questionId: number; score: number }[];
    totalScore: number;
  }
  