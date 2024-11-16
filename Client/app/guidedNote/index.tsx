import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnxietySlider from '../../components/notes/AnxietySlider';
import TextInputField from '../../components/notes/TextInputField';
import SubmitButton from '../../components/notes/SubmitButton';
import useAuth from '../../hooks/useAuth';
import config from '../../env';
import { useTheme } from '@/components/ThemeContext';

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

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert('Error', 'User is not authenticated.');
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
      const response = await fetch(`${config.API_URL}/directNotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Alert.alert('Submission Successful', 'Your responses have been submitted.');
        await AsyncStorage.removeItem('@formData');
      } else {
        Alert.alert('Submission Failed', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to submit the note at the moment. Please check your connection.');
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
        { icon: 'text', label: 'Describe your current experience with anxiety', value: description, onChange: setDescription },
        { icon: 'alert-circle', label: 'What might have triggered this anxiety episode?', value: trigger, onChange: setTrigger },
        { icon: 'heart', label: "Are there any coping strategies you're using?", value: copingStrategies, onChange: setCopingStrategies },
        { icon: 'pulse', label: "Describe any physical sensations you're feeling", value: physicalSymptoms, onChange: setPhysicalSymptoms },
        { icon: 'happy', label: 'How would you describe your emotional state?', value: emotionalState, onChange: setEmotionalState },
        { icon: 'chatbubble', label: 'What thoughts are you having right now?', value: selfTalk, onChange: setSelfTalk },
      ].map((field, index) => (
        <TextInputField key={index} icon={field.icon} label={field.label} value={field.value} onChange={field.onChange} />
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
