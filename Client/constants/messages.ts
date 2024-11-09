export const INITIAL_MESSAGES = [
    "I'm here to support you through this moment. How can I help you today?",
    "Let's work through this together. Would you like to share what's on your mind?",
    "You're not alone in this. How can I assist you right now?",
    "I'm here to listen and help. What would you like to focus on today?",
    "Sometimes just reaching out is the hardest part. I'm here to support you.",
    "Let's take this one step at a time. What's troubling you right now?",
    "It's okay to feel anxious. Would you like to talk about what you're experiencing?",
    "Your feelings are valid. How can we work together to help you feel better?",
    "I'm here to provide a safe space for you. What's on your mind?",
    "Let's find some calm together. What would help you most right now?",
    "Taking care of your mental health is important. How can I support you today?",
    "You've taken a good step by reaching out. What would you like to work on?",
    "Remember to breathe - I'm here to help. What's causing you concern?",
    "Sometimes anxiety can feel overwhelming. Let's work through this together.",
    "Your well-being matters. How can I assist you in this moment?"
  ];
  
  export const getRandomInitialMessage = () => {
    const randomIndex = Math.floor(Math.random() * INITIAL_MESSAGES.length);
    return {
      id: '1',
      text: INITIAL_MESSAGES[randomIndex],
      sender: 'bot' as const,
      timestamp: new Date()
    };
  };