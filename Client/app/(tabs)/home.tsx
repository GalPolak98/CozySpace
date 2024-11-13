import React from 'react';
import { useRouter } from 'expo-router';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';
import CustomButton from '@/components/CustomButton';

const Home = () => {
  const router = useRouter();

  return (
    <ThemedView className="flex-1 items-center justify-center">
      <ThemedText className="font-psemibold text-2xl mb-8">
        Welcome to Anxiety Helper
      </ThemedText>
      
      <CustomButton
        title="Talk to AI Assistant"
        handlePress={() => router.push('/chat')}
        containerStyles="flex-row items-center space-x-2"
        variant="primary"
        isLoading={false}
      />
      <CustomButton
        title="Document Now"
        handlePress={() => router.push('/notes')}
        containerStyles="w-full mt-7"
      />
      <CustomButton
        title="Direct Document"
        handlePress={() => router.push('/directedNotes')}
        containerStyles="w-full mt-7"
      />
    </ThemedView>
  );
};

export default Home;
