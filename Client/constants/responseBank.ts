import { Language } from '@/types/chat';

interface AnxietyResponses {
  symptoms: string[];
  thoughts: string[];
}

interface ResponseTypes {
  anxiety: AnxietyResponses;
  panic: string[];
  general: string[];
}

interface LanguageResponses {
  en: ResponseTypes;
  he: ResponseTypes;
}

export const RESPONSE_BANK: LanguageResponses = {
  en: {
    anxiety: {
      symptoms: [
        "I notice some anxiety symptoms. Let's try a quick grounding exercise - can you name 5 things you see around you?",
        "Let's focus on your breathing together - try following my count: in for 4, hold for 4, out for 4. How does that feel?",
        "I'm here with you. Can you place one hand on your chest and feel your breath? Let's take a few slow breaths together."
      ],
      thoughts: [
        "Let's pause and look at one thought at a time. What's the strongest worry on your mind right now?",
        "Those anxious thoughts can feel overwhelming. Could you share what specific concern is most present right now?",
        "I hear your mind is racing. Let's try to focus on just this moment - what needs your attention most right now?"
      ]
    },
    panic: [
      "I notice your anxiety is very high right now. Let's ground ourselves - can you feel your feet firmly on the floor?",
      "We'll get through this moment together. Try focusing on my words - can you name 3 things you can touch right now?",
      "This intense feeling will pass. Let's focus on taking slow, steady breaths together. I'm right here with you."
    ],
    general: [
      "I'm here to help. Would you like to try a quick calming exercise together?",
      "You're taking a good step by reaching out. What kind of support would be most helpful right now?",
      "I'm listening and here to support you. How can I help make this moment easier?"
    ]
  },
  he: {
    anxiety: {
      symptoms: [
        "אני מזהה סימני חרדה. בוא/י ננסה תרגיל קרקוע - האם תוכל/י לציין 5 דברים שאת/ה רואה סביבך?",
        "בוא/י נתמקד בנשימה יחד - נסה/י לעקוב אחר הספירה שלי: שאיפה ל-4, החזקה ל-4, נשיפה ל-4. איך זה מרגיש?",
        "אני כאן איתך. האם תוכל/י להניח יד אחת על החזה ולהרגיש את הנשימה? בוא/י ננשום לאט יחד."
      ],
      thoughts: [
        "בוא/י נעצור ונסתכל על מחשבה אחת בכל פעם. מה הדאגה החזקה ביותר במחשבותיך כרגע?",
        "המחשבות החרדות יכולות להיות מציפות. האם תוכל/י לשתף איזו דאגה ספציפית נוכחת ביותר כרגע?",
        "אני שומע שהמחשבות שלך רצות. בוא/י ננסה להתמקד ברגע הזה - מה דורש את תשומת הלב שלך כרגע?"
      ]
    },
    panic: [
      "אני מבחין/ה שהחרדה שלך גבוהה מאוד כרגע. בוא/י נתקרקע - האם את/ה יכול/ה להרגיש את כפות הרגליים שלך נוגעות ברצפה?",
      "נעבור את הרגע הזה ביחד. נסה/י להתמקד במילים שלי - האם תוכל/י לציין 3 דברים שאת/ה יכול/ה לגעת בהם כרגע?",
      "התחושה העזה הזו תחלוף. בוא/י נתמקד בנשימות איטיות ויציבות ביחד. אני כאן איתך."
    ],
    general: [
      "אני כאן כדי לעזור. האם תרצה/י לנסות תרגיל הרגעה קצר ביחד?",
      "עשית צעד טוב בכך שפנית. איזה סוג של תמיכה יהיה הכי מועיל כרגע?",
      "אני מקשיב וכאן לתמוך בך. איך אוכל להקל על הרגע הזה?"
    ]
  }
};

export const EMERGENCY_TERMS: Record<Language, string[]> = {
  en: [
    'suicide', 'kill myself', 'want to die', 'end it all',
    'hurt myself', 'self harm', 'give up'
  ],
  he: [
    'להתאבד', 'לשים קץ', 'למות', 'לסיים הכל',
    'לפגוע בעצמי', 'פגיעה עצמית', 'לוותר'
  ]
};

export type { ResponseTypes, LanguageResponses };