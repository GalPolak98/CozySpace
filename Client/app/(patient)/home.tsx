import React from 'react';
import { useRouter } from 'expo-router';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import CustomButton from '@/components/CustomButton';
import RecordingsSection from '../recording';
import { useLanguage } from '@/context/LanguageContext';

const HomePatient = () => {
  const router = useRouter();
  const { isRTL, t } = useLanguage();

  return (
    <ThemedView className="flex-1 items-center justify-center">
      <ThemedText 
        className="font-psemibold text-2xl mb-8"
        isRTL={isRTL}
      >
        {t.common.welcome}
      </ThemedText>

      <CustomButton
        title={t.homePatient.talkToAI}
        handlePress={() => router.push('/chat')}
        containerStyles="flex-row items-center space-x-2"
        variant="primary"
        isLoading={false}
        isRTL={isRTL}
      />
      <CustomButton
        title={t.homePatient.guidedDocumenting}
        handlePress={() => router.push('/guidedNote')}
        containerStyles="flex-row items-center space-x-2"
        variant="primary"
        isLoading={false}
        isRTL={isRTL}
      />
      <CustomButton
        title={t.homePatient.documentNow}
        handlePress={() => router.push('/directNote')}
        containerStyles="flex-row items-center space-x-2"
        variant="primary"
        isLoading={false}
        isRTL={isRTL}
      />
      
      <RecordingsSection />
    </ThemedView>
  );
};

export default HomePatient;