import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Alert, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../hooks/useAuth';
import config from '../env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DirectedNoteScreen: React.FC = () => {
  const [anxietyRating, setAnxietyRating] = useState(5);
  const [description, setDescription] = useState('');
  const [trigger, setTrigger] = useState('');
  const [copingStrategies, setCopingStrategies] = useState('');
  const [physicalSymptoms, setPhysicalSymptoms] = useState('');
  const [emotionalState, setEmotionalState] = useState('');
  const [selfTalk, setSelfTalk] = useState('');
  const userId = useAuth(); // Call `useAuth` to get `userId`

  const handleSubmit = async () => {
  
    if (!userId) {
      Alert.alert('Error', 'User is not authenticated.');
      return;
    }
  
    // Collect the data
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
      // Send the data to the backend
      const response = await fetch(`${config.API_URL}/directNotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        Alert.alert('Submission Successful', 'Your responses have been submitted.');
        // Optionally, clear saved data after successful submission
        await AsyncStorage.removeItem('@formData');
      } else {
        Alert.alert('Submission Failed', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to submit the note at the moment. Please check your connection.');
    }
  };
  

  useEffect(() => {
    // Load saved form data when the component mounts
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
    // Save the form data to AsyncStorage whenever it changes
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

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'text':
        return <Ionicons name="text" size={24} color="#0B72B8" style={styles.icon} />;
      case 'alert-circle':
        return <Ionicons name="alert-circle" size={24} color="#0B72B8" style={styles.icon} />;
      case 'heart':
        return <Ionicons name="heart" size={24} color="#0B72B8" style={styles.icon} />;
      case 'pulse':
        return <Ionicons name="pulse" size={24} color="#0B72B8" style={styles.icon} />;
      case 'happy':
        return <Ionicons name="happy" size={24} color="#0B72B8" style={styles.icon} />;
      case 'chatbubble':
        return <Ionicons name="chatbubble" size={24} color="#0B72B8" style={styles.icon} />;
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        {renderIcon('thermometer')}
        <Text style={styles.label}>How would you rate your current anxiety level?</Text>
        <Slider
          minimumValue={0}
          maximumValue={10}
          value={anxietyRating}
          onValueChange={(value) => setAnxietyRating(value)}
          step={1}
          style={styles.slider}
          minimumTrackTintColor="#0B72B8"
          maximumTrackTintColor="#D3D3D3"
          thumbTintColor="#0B72B8"
        />
        <Text style={styles.rating}>{anxietyRating.toFixed(0)}</Text>
      </View>

      {[
        { icon: 'text', label: 'Describe your current experience with anxiety', value: description, onChange: setDescription },
        { icon: 'alert-circle', label: 'What might have triggered this anxiety episode?', value: trigger, onChange: setTrigger },
        { icon: 'heart', label: "Are there any coping strategies you're using?", value: copingStrategies, onChange: setCopingStrategies },
        { icon: 'pulse', label: "Describe any physical sensations you're feeling", value: physicalSymptoms, onChange: setPhysicalSymptoms },
        { icon: 'happy', label: 'How would you describe your emotional state?', value: emotionalState, onChange: setEmotionalState },
        { icon: 'chatbubble', label: 'What thoughts are you having right now?', value: selfTalk, onChange: setSelfTalk },
      ].map((field, index) => (
        <View key={index} style={styles.section}>
          {renderIcon(field.icon)}
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            multiline
            value={field.value}
            onChangeText={field.onChange}
            style={styles.input}
            placeholder="Enter your response here..."
            placeholderTextColor="#999"
          />
        </View>
      ))}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  icon: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
  slider: {
    width: '100%',
    marginTop: 10,
  },
  rating: {
    fontSize: 18,
    color: '#0B72B8',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#0B72B8',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default DirectedNoteScreen;
