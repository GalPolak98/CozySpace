import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnxietySlider from '../../components/notes/AnxietySlider';
import TextInputField from '../../components/notes/TextInputField';
import SubmitButton from '../../components/notes/SubmitButton';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '@/components/ThemeContext';
import ENV from '../../env';
import { useLanguage } from '@/context/LanguageContext';

const DirectedNoteScreen: React.FC = () => {
  const [anxietyRating, setAnxietyRating] = useState(5);
  const [description, setDescription] = useState('');
  const [trigger, setTrigger] = useState('');
  const [copingStrategies, setCopingStrategies] = useState('');
  const [physicalSymptoms, setPhysicalSymptoms] = useState('');
  const [emotionalState, setEmotionalState] = useState('');
  const [selfTalk, setSelfTalk] = useState('');
  const userId = useAuth();
  const { theme: currentTheme } = useTheme();
  const { t, isRTL } = useLanguage();

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert(t.common.error, t.directedNote.notAuthenticated);
      return;
    }

    const timestamp = new Date().toISOString();
    const data = {
      userId,
      anxietyRating,
      description,
      trigger,
      copingStrategies,
      physicalSymptoms,
      emotionalState,
      selfTalk,
      timestamp,
    };

    try {
      const response = await fetch(`${ENV.EXPO_PUBLIC_SERVER_URL}/users/${userId}/saveGuidedNotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Alert.alert(t.common.success, t.directedNote.submitSuccess);
        await AsyncStorage.removeItem('@formData');
      } else {
        Alert.alert(t.common.error, t.directedNote.submitFailed);
      }
    } catch (error) {
      Alert.alert(t.common.error, t.directedNote.connectionError);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('@formData');

        if (savedData) {
          const { anxietyRating, description, trigger, copingStrategies, physicalSymptoms, emotionalState, selfTalk } = JSON.parse(savedData);
          setAnxietyRating(anxietyRating || 5);
          setDescription(description || '');
          setTrigger(trigger || '');
          setCopingStrategies(copingStrategies || '');
          setPhysicalSymptoms(physicalSymptoms || '');
          setEmotionalState(emotionalState || '');
          setSelfTalk(selfTalk || '');
        }
      } catch (error) {
        console.error('Error loading form data', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      const formData = {
        anxietyRating,
        description,
        trigger,
        copingStrategies,
        physicalSymptoms,
        emotionalState,
        selfTalk,
      };
      try {
        await AsyncStorage.setItem('@formData', JSON.stringify(formData));
      } catch (error) {
        console.error('Error saving form data', error);
      }
    };
    saveData();
  }, [anxietyRating, description, trigger, copingStrategies, physicalSymptoms, emotionalState, selfTalk]);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: currentTheme === 'dark' ? '#333' : '#F9F9F9' }]}>
      <AnxietySlider anxietyRating={anxietyRating} setAnxietyRating={setAnxietyRating} />

      {[
        { label: t.directedNote.describeExperience, value: description, onChange: setDescription },
        { label: t.directedNote.describeTrigger, value: trigger, onChange: setTrigger },
        { label: t.directedNote.copingStrategies, value: copingStrategies, onChange: setCopingStrategies },
        { label: t.directedNote.physicalSensations, value: physicalSymptoms, onChange: setPhysicalSymptoms },
        { label: t.directedNote.emotionalState, value: emotionalState, onChange: setEmotionalState },
        { label: t.directedNote.currentThoughts, value: selfTalk, onChange: setSelfTalk },
      ].map((field, index) => (
        <TextInputField key={index} label={field.label} value={field.value} onChange={field.onChange} />
      ))}

<SubmitButton onPress={handleSubmit} />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  }
});

export default DirectedNoteScreen;
