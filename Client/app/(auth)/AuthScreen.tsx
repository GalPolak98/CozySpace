import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
} from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../Services/firebaseConfig';
import { router, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '@/components/Loader';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';

// Firebase error messages mapping
const getErrorMessage = (code: string) => {
  const errorMessages: { [key: string]: string } = {
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect email or password',
    'auth/email-already-in-use': 'An account already exists with this email',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/network-request-failed': 'Network error. Please check your connection',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/operation-not-allowed': 'This operation is not allowed',
    'auth/invalid-credential': 'Invalid login credentials',
    'auth/invalid-password': 'Password must be at least 6 characters',
    'auth/missing-password': 'Please enter a password',
    'auth/missing-email': 'Please enter an email address',
    'auth/popup-closed-by-user': 'Authentication popup was closed',
    'auth/cancelled-popup-request': 'Authentication process was cancelled',
    'auth/internal-error': 'An error occurred during authentication',
    'auth/requires-recent-login': 'Please log in again to continue',
    'auth/provider-already-linked': 'Account already linked with another provider',
    'auth/invalid-verification-code': 'Invalid verification code',
    'auth/invalid-verification-id': 'Invalid verification ID',
    'auth/credential-already-in-use': 'This credential is already associated with another account',
  };
  
  return errorMessages[code] || 'An unexpected error occurred';
};

interface AuthScreenProps {
  mode: 'signin' | 'signup';
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          await AsyncStorage.setItem('userToken', token);
          router.push('/(tabs)/home');
        } catch (err) {
          console.error('Token storage error:', err);
          Alert.alert('Error', 'Failed to complete authentication');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(getErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ backgroundColor: colors.background }}
      className="flex-1"
    >
      <Loader isLoading={isLoading} />
      
      <View className="flex-1 justify-between p-6">
        {/* Header Section */}
        <View className="mt-12 items-center">
          <Text style={{ color: colors.text }} className="text-4xl font-pextrabold mb-2">
            {mode === 'signin' ? 'Welcome Back!' : 'Create Account'}
          </Text>
          <Text style={{ color: colors.textSecondary }} className="font-pregular text-xl">
            {mode === 'signin' 
              ? 'Sign in to continue' 
              : 'Begin your journey with us'}
          </Text>
        </View>

        {/* Form Section */}
        <View className="w-full">
          <CustomInput
            value={email}
            onChangeText={(text: string) => {
              setEmail(text);
              setError(null);
            }}
            placeholder="Email Address"
            keyboardType="email-address"
          />
          <CustomInput
            value={password}
            onChangeText={(text: string) => {
              setPassword(text);
              setError(null);
            }}
            placeholder="Password"
            isPassword
          />
          
          {error && (
            <Text style={{ color: colors.error }} className="mb-4 text-center font-pmedium">
              {error}
            </Text>
          )}

          <View className="space-y-4">
            <CustomButton
              title={mode === 'signin' ? 'Sign In' : 'Create Account'}
              handlePress={handleAuth}
              isLoading={isLoading}
              variant="primary"
              containerStyles="py-4"
              textStyles="text-lg"
            />
            
            <Link 
              href={mode === 'signin' ? '/sign-up' : '/sign-in'} 
              asChild
            >
              <TouchableOpacity>
                <Text style={{ color: colors.textSecondary }} className="text-center font-pmedium p-5">
                  {mode === 'signin' 
                    ? "Don't have an account? Sign Up" 
                    : 'Already have an account? Sign In'}
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Bottom Section */}
        <View className="mb-6">
          <Text style={{ color: colors.textSecondary }} className="text-center font-plight text-sm">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};