import { OptionType } from '@/types/onboarding';

const EN_EDUCATION_LEVELS: OptionType[] = [
    { id: 'phd', label: 'Ph.D.', sublabel: 'Doctor of Philosophy in Psychology or related field' },
    { id: 'psyd', label: 'Psy.D.', sublabel: 'Doctor of Psychology' },
    { id: 'masters', label: "Master's Degree", sublabel: 'M.A. or M.S. in Psychology or related field' },
    { id: 'counseling', label: 'Counseling Degree', sublabel: 'Licensed Professional Counselor' },
    { id: 'social', label: 'Social Work', sublabel: 'Master of Social Work (MSW)' },
    { id: 'other', label: 'Other Relevant Degree', sublabel: 'Other related mental health qualification' }
];

const HE_EDUCATION_LEVELS: OptionType[] = [
    { id: 'phd', label: 'דוקטורט', sublabel: 'דוקטור לפילוסופיה בפסיכולוגיה או תחום קשור' },
    { id: 'psyd', label: 'דוקטור לפסיכולוגיה', sublabel: 'דוקטור לפסיכולוגיה קלינית' },
    { id: 'masters', label: 'תואר שני', sublabel: 'M.A. או M.S. בפסיכולוגיה או תחום קשור' },
    { id: 'counseling', label: 'תואר בייעוץ', sublabel: 'יועץ מקצועי מוסמך' },
    { id: 'social', label: 'עבודה סוציאלית', sublabel: 'תואר שני בעבודה סוציאלית' },
    { id: 'other', label: 'תואר רלוונטי אחר', sublabel: 'הכשרה אחרת בתחום בריאות הנפש' }
];

const EN_EXPERIENCE_LEVELS: OptionType[] = [
    { id: '0-2', label: '0-2 years', sublabel: 'Early Career Professional' },
    { id: '3-5', label: '3-5 years', sublabel: 'Established Professional' },
    { id: '6-10', label: '6-10 years', sublabel: 'Experienced Professional' },
    { id: '10+', label: '10+ years', sublabel: 'Senior Professional' }
];

const HE_EXPERIENCE_LEVELS: OptionType[] = [
    { id: '0-2', label: '0-2 שנים', sublabel: 'מטפל בתחילת דרכו' },
    { id: '3-5', label: '3-5 שנים', sublabel: 'מטפל מבוסס' },
    { id: '6-10', label: '6-10 שנים', sublabel: 'מטפל מנוסה' },
    { id: '10+', label: '10+ שנים', sublabel: 'מטפל בכיר' }
];

const EN_SPECIALIZATIONS: OptionType[] = [
    { id: 'anxiety', label: 'Anxiety Disorders', sublabel: 'GAD, Panic Disorder, Social Anxiety' },
    { id: 'depression', label: 'Depression', sublabel: 'Major Depressive Disorder, Persistent Depressive Disorder' },
    { id: 'ptsd', label: 'PTSD', sublabel: 'Post-Traumatic Stress Disorder' },
    { id: 'ocd', label: 'OCD', sublabel: 'Obsessive-Compulsive Disorder' },
    { id: 'social', label: 'Social Anxiety', sublabel: 'Social Anxiety Disorder' },
    { id: 'panic', label: 'Panic Disorders', sublabel: 'Panic Attacks and Related Conditions' },
    { id: 'general', label: 'General Mental Health', sublabel: 'Overall Mental Wellness' },
    { id: 'relationships', label: 'Relationship Issues', sublabel: 'Interpersonal and Family Relations' },
    { id: 'stress', label: 'Stress Management', sublabel: 'Work-related and Life Stress' },
    { id: 'mindfulness', label: 'Mindfulness & Meditation', sublabel: 'Mindfulness-based Therapy' }
];

const HE_SPECIALIZATIONS: OptionType[] = [
    { id: 'anxiety', label: 'הפרעות חרדה', sublabel: 'חרדה כללית, הפרעת פאניקה, חרדה חברתית' },
    { id: 'depression', label: 'דיכאון', sublabel: 'דיכאון קליני, הפרעה דיכאונית מתמשכת' },
    { id: 'ptsd', label: 'פוסט-טראומה', sublabel: 'הפרעת דחק פוסט-טראומטית' },
    { id: 'ocd', label: 'או.סי.די', sublabel: 'הפרעה טורדנית-כפייתית' },
    { id: 'social', label: 'חרדה חברתית', sublabel: 'הפרעת חרדה חברתית' },
    { id: 'panic', label: 'הפרעות פאניקה', sublabel: 'התקפי פאניקה ומצבים קשורים' },
    { id: 'general', label: 'בריאות נפשית כללית', sublabel: 'רווחה נפשית כללית' },
    { id: 'relationships', label: 'בעיות במערכות יחסים', sublabel: 'יחסים בינאישיים ומשפחתיים' },
    { id: 'stress', label: 'ניהול לחץ', sublabel: 'לחץ בעבודה ובחיים' },
    { id: 'mindfulness', label: 'מיינדפולנס ומדיטציה', sublabel: 'טיפול מבוסס מיינדפולנס' }
];

export const EDUCATION_LEVELS = EN_EDUCATION_LEVELS;
export const EXPERIENCE_LEVELS = EN_EXPERIENCE_LEVELS;
export const SPECIALIZATIONS = EN_SPECIALIZATIONS;

export const getOptionsForLanguage = (options: OptionType[], language: string): OptionType[] => {
  if (language === 'he') {
    if (options === EN_EDUCATION_LEVELS) return HE_EDUCATION_LEVELS;
    if (options === EN_EXPERIENCE_LEVELS) return HE_EXPERIENCE_LEVELS;
    if (options === EN_SPECIALIZATIONS) return HE_SPECIALIZATIONS;
  }
  return options;
};