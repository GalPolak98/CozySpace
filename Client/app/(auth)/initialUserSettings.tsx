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

export const InitialRegistrationScreen: React.FC = () => {
  // Basic navigation state
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'patient' | 'therapist' | null>(null);
  
  // Common user information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // Patient-specific state
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

  // Therapist-specific state
  const [educationLevel, setEducationLevel] = useState<string | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<string | null>(null);
  const [specialization, setSpecialization] = useState<string | null>(null);
  const [workplace, setWorkplace] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [screenKey, setScreenKey] = useState(0); // Add this to force re-renders

  const totalSteps = userType === 'patient' ? 4 : 3;


  const handleBack = () => {
    if (step === 1 && userType) {
      // If we're on step 1 with a selected user type, go back to role selection
      setUserType(null);
    } else if (step > 1) {
      // Go back one step
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
      Alert.alert('Error', 'Please select your role to continue');
      return false;
    }

    switch (step) {
      case 1:
        if (!firstName.trim() || !lastName.trim()) {
          Alert.alert('Error', 'Please fill in both first and last name');
          return false;
        }
        return true;

      case 2:
        if (userType === 'therapist') {
          if (!educationLevel || !experienceLevel || !workplace.trim() || !specialization || !licenseNumber.trim()) {
            Alert.alert('Error', 'Please complete all professional information fields');
            return false;
          }
        } else if (!selectedTherapist) {
          Alert.alert('Error', 'Please select a therapist to continue');
          return false;
        }
        return true;

        case 3:
          case 3:
            if (userType === 'patient') {
              if (playMusic) {
                if (!selectedMusic) {
                  Alert.alert('Error', 'Please select a music category');
                  return false;
                }
                if (!selectedTrack) {
                  Alert.alert('Error', 'Please select a specific track');
                  return false;
                }
              }
              return true; 
            }
            return true;

      default:
        return true;
    }
  };

  const handleComplete = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId || !userType) {
        Alert.alert('Error', 'Authentication error. Please try signing in again.');
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
                  dataSharing: {
                    anxietyTracking: dataShareOptions.anxietyTracking,
                    personalDocumentation: dataShareOptions.personalDocumentation,
                  },
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

      console.log('Registration data:', JSON.stringify(registrationData, null, 2));

      await userService.registerUser(registrationData);

      // Navigate to appropriate screen based on user type
      if (userType === 'therapist') {
        router.replace('/(therapist)/home');
      } else {
        router.replace('/(patient)/home');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'Error',
        'Failed to complete registration. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleUserTypeChange = useCallback((type: 'patient' | 'therapist') => {
    setUserType(type);
    setScreenKey(prev => prev + 1);
  }, []);

  const renderStep = () => {
    const totalSteps = userType === 'patient' ? 4 : 3;

    // Role selection step
    if (step === 1 && !userType) {
      return (
        <OnboardingStep
          key={`role-selection-${screenKey}`}
          title="Welcome to AnxiEase"
          subtitle="Let's start by selecting your role"
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

    // Personal information step
    if (step === 1) {
      return (
        <OnboardingStep
          key={`step-1-${screenKey}`}
          title="Personal Information"
          subtitle="Tell us about yourself"
          currentStep={step}
          totalSteps={totalSteps}
        >
          <PersonalInfoSection
            firstName={firstName}
            lastName={lastName}
            setFirstName={setFirstName}
            setLastName={setLastName}
          />
        </OnboardingStep>
      );
    }

    // Therapist selection or professional background step
    if (step === 2) {
      if (userType === 'patient') {
        return (
          <OnboardingStep
            key={`step-2-${screenKey}`}
            title="Connect with a Therapist"
            subtitle="Choose your therapist and set sharing preferences"
            currentStep={step}
            totalSteps={totalSteps}
          >
            <TherapistSelectionSection
              selectedTherapist={selectedTherapist}
              setSelectedTherapist={setSelectedTherapist}
              dataShareOptions={dataShareOptions}
              setDataShareOptions={setDataShareOptions}
            />
          </OnboardingStep>
        );
      }

      return (
        <OnboardingStep
          title="Professional Background"
          subtitle="Tell us about your qualifications"
          currentStep={step}
          totalSteps={totalSteps}
        >
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
        </OnboardingStep>
      );
    }

    // Customization or completion step
    if (step === 3) {
      if (userType === 'patient') {
        return (
          <OnboardingStep
            title="Customize Your Experience"
            subtitle="Set up your anxiety management tools"
            currentStep={step}
            totalSteps={totalSteps}
          >
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
          </OnboardingStep>
        );
      }

      return (
        <OnboardingStep
          title="You're All Set!"
          subtitle="Welcome to the AnxiEase professional network"
          currentStep={step}
          totalSteps={totalSteps}
        >
          <CompletionStep userType="therapist" />
        </OnboardingStep>
      );
    }

    // Final completion step for patients
    if (step === 4 && userType === 'patient') {
      return (
        <OnboardingStep
          title="You're All Set!"
          subtitle="Let's start managing your anxiety together"
          currentStep={step}
          totalSteps={totalSteps}
        >
          <CompletionStep userType="patient" />
        </OnboardingStep>
      );
    }

    // Fallback return
    return null;
  };

  const isRoleSelection = step === 1 && !userType;

  return (
    <OnboardingContainer
      onNext={handleNext}
      onBack={handleBack}
      isLastStep={step === totalSteps}
      currentStep={step}
      isRoleSelection={isRoleSelection}
    >
      {renderStep()}
    </OnboardingContainer>
  );
};

export default InitialRegistrationScreen;