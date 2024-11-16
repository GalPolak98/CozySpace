import { SPECIALIZATIONS } from "@/constants/onboarding";

export type Specialization = typeof SPECIALIZATIONS[number];

export interface PersonalInfoProps {
    firstName: string;
    lastName: string;
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
  }
  
  export interface RoleSelectionProps {
    userType: 'patient' | 'therapist' | null;
    setUserType: (type: 'patient' | 'therapist') => void;
  }
  
  export interface DataShareOptions {
    anxietyTracking: boolean;
    personalDocumentation: boolean;
  }
  
  export interface TherapistSelectionProps {
    selectedTherapist: string | null;
    setSelectedTherapist: (id: string) => void;
    shareWithTherapist: boolean;
    setShareWithTherapist: (share: boolean) => void;
    dataShareOptions: DataShareOptions;
    setDataShareOptions: (options: DataShareOptions | ((prev: DataShareOptions) => DataShareOptions)) => void;
  }
  
  export interface MusicSelectionProps {
    selectedMusic: string | null;
    setSelectedMusic: (id: string) => void;
  }

  export interface OptionType {
    id: string;
    label: string;
    sublabel?: string;
  }
  
  export interface TherapistQualificationsProps {
    educationLevel: string | null;
    setEducationLevel: (value: string | null) => void;
    experienceLevel: string | null;
    setExperienceLevel: (value: string | null) => void;
    workplace: string;
    setWorkplace: (value: string) => void;
    specialization: string | null;
    setSpecialization: (value: string | null) => void;
    licenseNumber: string;
    setLicenseNumber: (value: string) => void;
  }
  
  export interface CustomDropdownProps {
    options: OptionType[];
    value: string | null;
    onChange: (value: string) => void;
    placeholder: string;
    label?: string;
  }