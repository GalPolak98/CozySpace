import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import CustomButton from "../../components/CustomButton";
import RecordingsSection from '@/components/Recordings';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <CustomButton
        title="Document Now"
        handlePress={() => router.push('/notes')}
        containerStyles="w-full mt-7"
      />
            <RecordingsSection />

    </View>
  );
}
