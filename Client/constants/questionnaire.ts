export interface DassQuestion {
    id: number;
    text: {
      he: {
        male: string;
        female: string;
        default: string;
      };
      en: string;
    };
  }

export const DASS_QUESTIONS: DassQuestion[] = [
  {
    id: 1,
    text: {
      he: {
        male: "התקשיתי להיות נינוח",
        female: "התקשיתי להיות נינוחה",
        default: "התקשיתי להיות נינוח",
      },
      en: "I found it hard to wind down",
    },
  },
  {
    id: 2,
    text: {
      he: {
        male: "חשתי ביובש בפה",
        female: "חשתי ביובש בפה",
        default: "חשתי ביובש בפה",
      },
      en: "I was aware of dryness of my mouth",
    },
  },
  {
    id: 3,
    text: {
      he: {
        male: "התקשיתי לחוות כל הרגשה חיובית",
        female: "התקשיתי לחוות כל הרגשה חיובית",
        default: "התקשיתי לחוות כל הרגשה חיובית",
      },
      en: "I could not seem to experience any positive feeling at all",
    },
  },
  {
    id: 4,
    text: {
      he: {
        male: "חשתי קושי בנשימה (לדוגמא, נשימה מואצת במיוחד, חוסר אוויר בהעדר פעילות גופנית מאומצת)",
        female:
          "חשתי קושי בנשימה (לדוגמא, נשימה מואצת במיוחד, חוסר אוויר בהעדר פעילות גופנית מאומצת)",
        default:
          "חשתי קושי בנשימה (לדוגמא, נשימה מואצת במיוחד, חוסר אוויר בהעדר פעילות גופנית מאומצת)",
      },
      en: "I experienced breathing difficulty (eg, excessively rapid breathing, breathlessness in the absence of physical exertion)",
    },
  },
  {
    id: 5,
    text: {
      he: {
        male: "לא היו לי הכוחות לעשות דברים",
        female: "לא היו לי הכוחות לעשות דברים",
        default: "לא היו לי הכוחות לעשות דברים",
      },
      en: "I found it difficult to work up the initiative to do things",
    },
  },
  {
    id: 6,
    text: {
      he: {
        male: "נטיתי להגזים בתגובותיי למצבים מסוימים",
        female: "נטיתי להגזים בתגובותיי למצבים מסוימים",
        default: "נטיתי להגזים בתגובותיי למצבים מסוימים",
      },
      en: "I tended to over-react to situations",
    },
  },
  {
    id: 7,
    text: {
      he: {
        male: "חשתי רעד (למשל, בידיים)",
        female: "חשתי רעד (למשל, בידיים)",
        default: "חשתי רעד (למשל, בידיים)",
      },
      en: "I experienced trembling (eg, in the hands)",
    },
  },
  {
    id: 8,
    text: {
      he: {
        male: "הרגשתי שאני מתעצבן יותר מדי",
        female: "הרגשתי שאני מתעצבנת יותר מדי",
        default: "הרגשתי שאני מתעצבן/ת יותר מדי",
      },
      en: "I felt that I was using a lot of nervous energy",
    },
  },
  {
    id: 9,
    text: {
      he: {
        male: "חששתי ממצבים בהם אולי אכנס לחרדה ואעשה צחוק מעצמי",
        female: "חששתי ממצבים בהם אולי אכנס לחרדה ואעשה צחוק מעצמי",
        default: "חששתי ממצבים בהם אולי אכנס לחרדה ואעשה צחוק מעצמי",
      },
      en: "I was worried about situations in which I might panic and make a fool of myself",
    },
  },
  {
    id: 10,
    text: {
      he: {
        male: "הרגשתי שאין לי למה לצפות בחיים",
        female: "הרגשתי שאין לי למה לצפות בחיים",
        default: "הרגשתי שאין לי למה לצפות בחיים",
      },
      en: "I felt that I had nothing to look forward to",
    },
  },
  {
    id: 11,
    text: {
      he: {
        male: "הרגשתי שאני קצר רוח",
        female: "הרגשתי שאני קצרת רוח",
        default: "הרגשתי שאני קצר/ת רוח",
      },
      en: "I found myself getting agitated",
    },
  },
  {
    id: 12,
    text: {
      he: {
        male: "התקשיתי להירגע",
        female: "התקשיתי להירגע",
        default: "התקשיתי להירגע",
      },
      en: "I found it difficult to relax",
    },
  },
  {
    id: 13,
    text: {
      he: {
        male: "חוויתי דכדוך ותחושות עצבות",
        female: "חוויתי דכדוך ותחושות עצבות",
        default: "חוויתי דכדוך ותחושות עצבות",
      },
      en: "I felt down-hearted and blue",
    },
  },
  {
    id: 14,
    text: {
      he: {
        male: "הייתי חסר סובלנות כלפי כל דבר שהפריע לי במעשיי",
        female: "הייתי חסרת סובלנות כלפי כל דבר שהפריע לי במעשיי",
        default: "הייתי חסר/ת סובלנות כלפי כל דבר שהפריע לי במעשיי",
      },
      en: "I was intolerant of anything that kept me from getting on with what I was doing",
    },
  },
  {
    id: 15,
    text: {
      he: {
        male: "הרגשתי שאני קרוב למצב של פאניקה",
        female: "הרגשתי שאני קרובה למצב של פאניקה",
        default: "הרגשתי שאני קרוב/ה למצב של פאניקה",
      },
      en: "I felt I was close to panic",
    },
  },
  {
    id: 16,
    text: {
      he: {
        male: "לא הצלחתי להתלהב משום דבר",
        female: "לא הצלחתי להתלהב משום דבר",
        default: "לא הצלחתי להתלהב משום דבר",
      },
      en: "I was unable to become enthusiastic about anything",
    },
  },
  {
    id: 17,
    text: {
      he: {
        male: "הערכתי העצמית כאדם הייתה מאוד נמוכה",
        female: "הערכתי העצמית כאדם הייתה מאוד נמוכה",
        default: "הערכתי העצמית כאדם הייתה מאוד נמוכה",
      },
      en: "I felt I was not worth much as a person",
    },
  },
  {
    id: 18,
    text: {
      he: {
        male: "הרגשתי רגיש ופגיע למדי",
        female: "הרגשתי רגישה ופגיעה למדי",
        default: "הרגשתי רגיש/ה ופגיע/ה למדי",
      },
      en: "I felt that I was rather touchy",
    },
  },
  {
    id: 19,
    text: {
      he: {
        male: "חשתי בפעילות ליבי גם ללא פעילות גופנית (לדוגמה, הרגשת עלייה בקצב הלב, החסרת פעימת לב)",
        female:
          "חשתי בפעילות ליבי גם ללא פעילות גופנית (לדוגמה, הרגשת עלייה בקצב הלב, החסרת פעימת לב)",
        default:
          "חשתי בפעילות ליבי גם ללא פעילות גופנית (לדוגמה, הרגשת עלייה בקצב הלב, החסרת פעימת לב)",
      },
      en: "I was aware of the action of my heart in the absence of physical exertion (eg, sense of heart rate increase, heart missing a beat)",
    },
  },
  {
    id: 20,
    text: {
      he: {
        male: "הייתי מפוחד גם ללא סיבה מיוחדת",
        female: "הייתי מפוחדת גם ללא סיבה מיוחדת",
        default: "הייתי מפוחד/ת גם ללא סיבה מיוחדת",
      },
      en: "I felt scared without any good reason",
    },
  },
  {
    id: 21,
    text: {
      he: {
        male: "הרגשתי שהחיים חסרי משמעות",
        female: "הרגשתי שהחיים חסרי משמעות",
        default: "הרגשתי שהחיים חסרי משמעות",
      },
      en: "I felt that life was meaningless",
    },
  },
];