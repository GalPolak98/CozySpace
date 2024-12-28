interface Message {
  id: string;
  text: string;
  sender: 'bot';
  timestamp: Date;
}

interface LocalizedMessages {
  en: string[];
  he: string[];
}

export const INITIAL_MESSAGES: LocalizedMessages = {
  en: [
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
  ],
  he: [
    "אני כאן לתמוך בך ברגע זה. איך אוכל לעזור לך היום?",
    "בוא נעבור את זה יחד. תרצה לשתף במה שעובר לך בראש?",
    "אתה לא לבד בזה. איך אני יכול לסייע לך כרגע?",
    "אני כאן להקשיב ולעזור. על מה היית רוצה להתמקד היום?",
    "לפעמים הצעד הראשון הוא הכי קשה. אני כאן לתמוך בך.",
    "בוא נתקדם צעד אחר צעד. מה מטריד אותך כרגע?",
    "זה בסדר להרגיש חרדה. האם תרצה לדבר על מה שאתה חווה?",
    "הרגשות שלך תקינים. איך נוכל לעבוד יחד כדי לעזור לך להרגיש טוב יותר?",
    "אני כאן כדי לספק לך מרחב בטוח. מה עובר לך בראש?",
    "בוא נמצא רוגע יחד. מה יעזור לך הכי הרבה כרגע?",
    "לדאוג לבריאות הנפשית שלך זה חשוב. איך אני יכול לתמוך בך היום?",
    "עשית צעד טוב בכך שפנית. על מה היית רוצה לעבוד?",
    "זכור לנשום - אני כאן לעזור. מה מדאיג אותך?",
    "לפעמים חרדה יכולה להרגיש מציפה. בוא נעבור את זה יחד.",
    "הרווחה הנפשית שלך חשובה. איך אני יכול לסייע לך ברגע זה?"
  ]
};

export const getRandomInitialMessage = (language: 'en' | 'he'): Message => {
  const messages = INITIAL_MESSAGES[language];
  const randomIndex = Math.floor(Math.random() * messages.length);
  
  return {
    id: '1',
    text: messages[randomIndex],
    sender: 'bot',
    timestamp: new Date()
  };
};