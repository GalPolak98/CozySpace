import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { auth } from '@/services/firebaseConfig';
import { OnboardingContainer } from '@/components/onboarding/OnboardingContainer';
import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import { RoleSelectionSection } from '@/components/onboarding/RoleSelectionSection';
import { PersonalInfoSection } from '@/components/onboarding/PersonalInfoSection';
import { TherapistSelectionSection } from '@/components/onboarding/TherapistSelectionSection';
import { PatientCustomizationStep } from '@/components/onboarding/PatientCustomizationStep';
import { TherapistQualificationsSection } from '@/components/onboarding/TherapistQualificationsSection';
import { DataShareOptions, RegistrationData } from '@/types/onboarding';
import { CompletionStep } from '@/components/onboarding/CompletionStep';
import { userService } from '@/services/userService';
import { useLanguage } from '@/context/LanguageContext';
import useAuth from '@/hooks/useAuth';

export const InitialRegistrationScreen: React.FC = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'patient' | 'therapist' | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
  const [enableVibrations, setEnableVibrations] = useState(false);
  const [dataShareOptions, setDataShareOptions] = useState<DataShareOptions>({
    anxietyTracking: false,
    personalDocumentation: false
  });
  const [useSmartJewelry, setUseSmartJewelry] = useState(false);
  const [playMusic, setPlayMusic] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [educationLevel, setEducationLevel] = useState<string | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<string | null>(null);
  const [specialization, setSpecialization] = useState<string | null>(null);
  const [workplace, setWorkplace] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [screenKey, setScreenKey] = useState(0);
  const userId = useAuth();

  const totalSteps = userType === 'patient' ? 4 : 3;

  const handleBack = () => {
    if (step === 1 && userType) {
      setUserType(null);
    } else if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step === totalSteps) {
        handleComplete();
      } else {
        setStep(prev => prev + 1);
      }
    }
  };

  const validateStep = () => {
    if (!userType && step === 1) {
      Alert.alert(t.errors.error, t.registration.selectRole);
      return false;
    }

    switch (step) {
      case 1:
        if (!firstName.trim() || !lastName.trim()) {
          Alert.alert(t.errors.error, t.registration.fillNames);
          return false;
        }
        return true;

      case 2:
        if (userType === 'therapist') {
          if (!educationLevel || !experienceLevel || !workplace.trim() || !specialization || !licenseNumber.trim()) {
            Alert.alert(t.errors.error, t.registration.completeAllFields);
            return false;
          }
        } else if (!selectedTherapist) {
          Alert.alert(t.errors.error, t.registration.selectTherapist);
          return false;
        }
        return true;

      case 3:
        if (userType === 'patient' && playMusic) {
          if (!selectedMusic) {
            Alert.alert(t.errors.error, t.registration.selectMusicCategory);
            return false;
          }
          if (!selectedTrack) {
            Alert.alert(t.errors.error, t.registration.selectTrack);
            return false;
          }
        }
        return true;

      default:
        return true;
    }
  };

  const handleComplete = async () => {
    try {
      if (!userId || !userType) {
        Alert.alert(t.errors.error, t.auth.authError);
        return;
      }

      const registrationData: RegistrationData = {
        userId,
        timestamp: new Date().toISOString(),
        userType,
        personalInfo: {
          firstName,
          lastName,
          email: auth.currentUser?.email || null,
        },
        ...(userType === 'therapist' 
          ? {
              professionalInfo: {
                educationLevel: educationLevel!,
                experienceLevel: experienceLevel!,
                workplace,
                specialization: specialization!,
                licenseNumber,
              }
            } 
          : {
              patientInfo: {
                therapistInfo: {
                  selectedTherapistId: selectedTherapist,
                  dataSharing: dataShareOptions,
                },
                toolsPreferences: {
                  smartJewelry: {
                    enabled: useSmartJewelry,
                    vibrationAlerts: enableVibrations,
                  },
                  musicTherapy: {
                    enabled: playMusic,
                    selectedTrackId: selectedTrack,
                  },
                },
              }
            }
        ),
      };

      await userService.registerUser(registrationData);
      router.replace(userType === 'therapist' ? '/(therapist)/home' : '/(patient)/home');
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(t.errors.error, t.registration.registrationFailed);
    }
  };

  const handleUserTypeChange = useCallback((type: 'patient' | 'therapist') => {
    setUserType(type);
    setScreenKey(prev => prev + 1);
  }, []);

  const renderStep = () => {
    if (step === 1 && !userType) {
      return (
        <OnboardingStep
          key={`role-selection-${screenKey}`}
          title={t.onboarding.welcome.title}
          subtitle={t.registration.selectRoleSubtitle}
          currentStep={1}
          totalSteps={1}
        >
          <RoleSelectionSection
            userType={userType}
            setUserType={handleUserTypeChange}
          />
        </OnboardingStep>
      );
    }

    const steps = {
      1: {
        title: t.registration.personalInfo,
        subtitle: t.registration.tellAboutYourself,
        component: (
          <PersonalInfoSection
            firstName={firstName}
            lastName={lastName}
            setFirstName={setFirstName}
            setLastName={setLastName}
          />
        ),
      },
      2: {
        title: userType === 'patient' ? t.registration.connectTherapist : t.registration.professionalBackground,
        subtitle: userType === 'patient' ? t.registration.chooseTherapist : t.registration.qualifications,
        component: userType === 'patient' ? (
          <TherapistSelectionSection
            selectedTherapist={selectedTherapist}
            setSelectedTherapist={setSelectedTherapist}
            dataShareOptions={dataShareOptions}
            setDataShareOptions={setDataShareOptions}
          />
        ) : (
          <TherapistQualificationsSection
            educationLevel={educationLevel}
            setEducationLevel={setEducationLevel}
            experienceLevel={experienceLevel}
            setExperienceLevel={setExperienceLevel}
            workplace={workplace}
            setWorkplace={setWorkplace}
            specialization={specialization}
            setSpecialization={setSpecialization}
            licenseNumber={licenseNumber}
            setLicenseNumber={setLicenseNumber}
          />
        ),
      },
      3: {
        title: userType === 'patient' ? t.registration.customizeExperience : t.registration.allSet,
        subtitle: userType === 'patient' ? t.registration.setupTools : t.registration.welcomeProfessional,
        component: userType === 'patient' ? (
          <PatientCustomizationStep
            useSmartJewelry={useSmartJewelry}
            setUseSmartJewelry={setUseSmartJewelry}
            enableVibrations={enableVibrations}
            setEnableVibrations={setEnableVibrations}
            playMusic={playMusic}
            setPlayMusic={setPlayMusic}
            selectedMusic={selectedMusic}
            setSelectedMusic={setSelectedMusic}
            selectedTrack={selectedTrack}
            setSelectedTrack={setSelectedTrack}
          />
        ) : (
          <CompletionStep userType="therapist" />
        ),
      },
      4: userType === 'patient' ? {
        title: t.registration.allSet,
        subtitle: t.registration.startManaging,
        component: <CompletionStep userType="patient" />
      } : null,
    };

    const currentStep = steps[step as keyof typeof steps];
    if (!currentStep) return null;

    return (
      <OnboardingStep
        key={`step-${step}-${screenKey}`}
        title={currentStep.title}
        subtitle={currentStep.subtitle}
        currentStep={step}
        totalSteps={totalSteps}
      >
        {currentStep.component}
      </OnboardingStep>
    );
  };

  return (
    <OnboardingContainer
      onNext={handleNext}
      onBack={handleBack}
      isLastStep={step === totalSteps}
      currentStep={step}
      isRoleSelection={step === 1 && !userType}
    >
      {renderStep()}
    </OnboardingContainer>
  );
};

export default InitialRegistrationScreen;