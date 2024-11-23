import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import { router, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '@/components/Loader';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import { AuthRoutingService } from '@/services/authRoutingService';
import { authManager } from '@/services/authManager';

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

const AuthScreen: React.FC<AuthScreenProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const isMounted = useRef(true);
  const navigationInProgress = useRef(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  // Set up auth listener once on mount
  useEffect(() => {
    let unsubscribe: () => void;

    const setupAuthListener = () => {
      if (!authManager.shouldSetupListener()) {
        console.log('Auth listener already exists, skipping setup');
        return;
      }

      console.log('Setting up auth listener');
      authManager.incrementListenerCount();
      
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log('Auth state changed, isHandlingAuth:', authManager.isProcessing());
        
        if (!isMounted.current || navigationInProgress.current) {
          console.log('Skipping auth handling - not mounted or navigation in progress');
          return;
        }
    
        if (user) {
          try {
            navigationInProgress.current = true;
            console.log('Starting auth process for user:', user.uid);
    
            const token = await user.getIdToken();
            await AsyncStorage.setItem('userToken', token);
    
            if (!isMounted.current) {
              console.log('Component unmounted during auth process');
              return;
            }
    
            const creationTime = new Date(user.metadata.creationTime!).getTime();
            const lastSignInTime = new Date(user.metadata.lastSignInTime!).getTime();
            const isNewUser = Math.abs(creationTime - lastSignInTime) < 1000;
    
            console.log('Processing user, isNewUser:', isNewUser);
            
            if (mode === 'signup' || isNewUser) {
              console.log('New signup or new user, routing to initial settings');
              router.replace('/(auth)/initialUserSettings');
            } else {
              console.log('Existing user, checking routing');
              await AuthRoutingService.handleAuthRouting();
            }
          } catch (err) {
            console.error('Auth state change error:', err);
            if (isMounted.current) {
              Alert.alert('Error', 'Failed to complete authentication');
            }
          } finally {
            if (isMounted.current) {
              navigationInProgress.current = false;
            }
          }
        } else {
          console.log('No user in auth state change');
        }
      });

      // Store the unsubscribe function in the AuthManager
      authManager.setAuthUnsubscribe(unsubscribe);
    };
    
    setupAuthListener();
    
    return () => {
      console.log('Cleaning up auth listener');
      isMounted.current = false;
      if (unsubscribe) {
        unsubscribe();
        authManager.decrementListenerCount();
      }
    };
  }, [mode]);

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    navigationInProgress.current = false;
    authManager.reset();

    try {
      console.log('Attempting authentication for mode:', mode);
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(getErrorMessage(err.code));
      authManager.setProcessing(false);
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ backgroundColor: colors.background }}
      className="flex-1"
    >
      <Loader isLoading={isLoading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
      <View className="flex-1 justify-between p-6">
        <View className="mt-8 items-center">
          <Text style={{ color: colors.text }} className="text-4xl font-pextrabold mb-2">
            {mode === 'signin' ? 'Welcome Back!' : 'Create Account'}
          </Text>
          <Text style={{ color: colors.textSecondary }} className="font-pregular text-xl mb-4">
            {mode === 'signin' ? 'Sign in to continue' : 'Begin your journey with us'}
          </Text>
        </View>

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
          
          {mode === 'signup' && (
            <CustomInput
              value={confirmPassword}
              onChangeText={(text: string) => {
                setConfirmPassword(text);
                setError(null);
              }}
              placeholder="Confirm Password"
              isPassword
            />
          )}
          
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
              <TouchableOpacity className="py-2">
                  <Text style={{ color: colors.primary }} className="text-center font-pmedium">
                    {mode === 'signin' 
                      ? "Don't have an account? Sign Up" 
                      : 'Already have an account? Sign In'}
                  </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <View className="mb-6">
          <Text style={{ color: colors.textSecondary }} className="text-center font-plight text-sm">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;