
import { OptionType } from '@/types/onboarding';

export const EDUCATION_LEVELS: OptionType[] = [
    { 
      id: 'phd', 
      label: 'Ph.D.', 
      sublabel: 'Doctor of Philosophy in Psychology or related field' 
    },
    { 
      id: 'psyd', 
      label: 'Psy.D.', 
      sublabel: 'Doctor of Psychology' 
    },
    { 
      id: 'masters', 
      label: 'Master\'s Degree', 
      sublabel: 'M.A. or M.S. in Psychology or related field' 
    },
    { 
      id: 'counseling', 
      label: 'Counseling Degree', 
      sublabel: 'Licensed Professional Counselor' 
    },
    { 
      id: 'social', 
      label: 'Social Work', 
      sublabel: 'Master of Social Work (MSW)' 
    },
    {
      id: 'other',
      label: 'Other Relevant Degree',
      sublabel: 'Other related mental health qualification'
    }
  ];
  
  export const EXPERIENCE_LEVELS: OptionType[] = [
    { 
      id: '0-2', 
      label: '0-2 years', 
      sublabel: 'Early Career Professional' 
    },
    { 
      id: '3-5', 
      label: '3-5 years', 
      sublabel: 'Established Professional' 
    },
    { 
      id: '6-10', 
      label: '6-10 years', 
      sublabel: 'Experienced Professional' 
    },
    { 
      id: '10+', 
      label: '10+ years', 
      sublabel: 'Senior Professional' 
    }
  ];
  
  export const SPECIALIZATIONS: OptionType[] = [
    { 
      id: 'anxiety', 
      label: 'Anxiety Disorders', 
      sublabel: 'GAD, Panic Disorder, Social Anxiety' 
    },
    { 
      id: 'depression', 
      label: 'Depression', 
      sublabel: 'Major Depressive Disorder, Persistent Depressive Disorder' 
    },
    { 
      id: 'ptsd', 
      label: 'PTSD', 
      sublabel: 'Post-Traumatic Stress Disorder' 
    },
    { 
      id: 'ocd', 
      label: 'OCD', 
      sublabel: 'Obsessive-Compulsive Disorder' 
    },
    { 
      id: 'social', 
      label: 'Social Anxiety', 
      sublabel: 'Social Anxiety Disorder' 
    },
    { 
      id: 'panic', 
      label: 'Panic Disorders', 
      sublabel: 'Panic Attacks and Related Conditions' 
    },
    { 
      id: 'general', 
      label: 'General Mental Health', 
      sublabel: 'Overall Mental Wellness' 
    },
    {
      id: 'relationships',
      label: 'Relationship Issues',
      sublabel: 'Interpersonal and Family Relations'
    },
    {
      id: 'stress',
      label: 'Stress Management',
      sublabel: 'Work-related and Life Stress'
    },
    {
      id: 'mindfulness',
      label: 'Mindfulness & Meditation',
      sublabel: 'Mindfulness-based Therapy'
    }
  ];
  
  // Add education levels that don't require professional licensing
  export const PATIENT_EDUCATION_LEVELS: OptionType[] = [
    {
      id: 'high-school',
      label: 'High School',
      sublabel: 'High School Diploma or Equivalent'
    },
    {
      id: 'some-college',
      label: 'Some College',
      sublabel: 'Partial College Education'
    },
    {
      id: 'associates',
      label: 'Associate\'s Degree',
      sublabel: 'Two-Year College Degree'
    },
    {
      id: 'bachelors',
      label: 'Bachelor\'s Degree',
      sublabel: 'Four-Year College Degree'
    },
    {
      id: 'masters',
      label: 'Master\'s Degree',
      sublabel: 'Graduate Degree'
    },
    {
      id: 'doctorate',
      label: 'Doctorate',
      sublabel: 'Ph.D. or Other Doctorate'
    },
    {
      id: 'other',
      label: 'Other Education',
      sublabel: 'Other Educational Background'
    }
  ];