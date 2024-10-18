import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Services/firebaseConfig';
import { router, Link } from 'expo-router';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/(tabs)/home');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View className="flex-1 justify-center p-4">
      <Text className="text-2xl font-bold mb-6 text-center">Sign In</Text>
      <TextInput
        className="h-12 border border-gray-300 rounded-md mb-4 px-3"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        className="h-12 border border-gray-300 rounded-md mb-6 px-3"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity 
        className="bg-blue-500 py-3 rounded-md mb-4"
        onPress={handleSignIn}
      >
        <Text className="text-white text-center font-bold">
          Sign In
        </Text>
      </TouchableOpacity>
      {error && <Text className="text-red-500 mb-4 text-center">{error}</Text>}
      <Link href="/sign-up" asChild>
        <TouchableOpacity>
          <Text className="text-blue-500 text-center">
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default SignInScreen;