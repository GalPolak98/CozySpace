export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }

  export interface ChatSession {
    id: string;
    messages: Message[];
    createdAt: Date;
    lastMessageAt: Date;
    hasUserMessages: boolean;
  }

export type Language = 'en' | 'he';
export type Gender = 'male' | 'female';