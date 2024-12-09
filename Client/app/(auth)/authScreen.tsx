import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebaseConfig';
import { router, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '@/components/Loader';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import ThemedText from '@/components/ThemedText';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/styles/Theme';
import { AuthRoutingService } from '@/services/authRoutingService';
import { authManager } from '@/services/authManager';
import { useLanguage } from '@/context/LanguageContext';

const getErrorMessage = (code: string, t: any) => {
  const errorMessages: { [key: string]: string } = {
    'auth/invalid-email': t.errors.invalidEmail,
    'auth/user-disabled': t.errors.userDisabled,
    'auth/user-not-found': t.errors.userNotFound,
    'auth/wrong-password': t.errors.wrongPassword,
    'auth/email-already-in-use': t.errors.emailInUse,
    'auth/weak-password': t.errors.weakPassword,
    'auth/network-request-failed': t.errors.networkError,
    'auth/too-many-requests': t.errors.tooManyRequests,
    'auth/operation-not-allowed': t.errors.operationNotAllowed,
    'auth/invalid-credential': t.errors.invalidCredentials,
    'auth/invalid-password': t.errors.invalidPassword,
    'auth/missing-password': t.errors.missingPassword,
    'auth/missing-email': t.errors.missingEmail,
  };
  
  return errorMessages[code] || t.errors.unexpected;
};

interface AuthScreenProps {
  mode: 'signin' | 'signup';
}

const AuthScreen: React.FC<AuthScreenProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const isMounted = useRef(true);
  const navigationInProgress = useRef(false);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    let unsubscribe: () => void;

    const setupAuthListener = () => {
      if (!authManager.shouldSetupListener()) return;

      authManager.incrementListenerCount();
      
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!isMounted.current || navigationInProgress.current) return;
    
        if (user) {
          try {
            navigationInProgress.current = true;    
            const token = await user.getIdToken();
            await AsyncStorage.setItem('userToken', token);
    
            if (!isMounted.current) return;
    
            const creationTime = new Date(user.metadata.creationTime!).getTime();
            const lastSignInTime = new Date(user.metadata.lastSignInTime!).getTime();
            const isNewUser = Math.abs(creationTime - lastSignInTime) < 1000;
            
            if (mode === 'signup' || isNewUser) {
              router.replace('/(auth)/initialUserSettings');
            } else {
              await AuthRoutingService.handleAuthRouting();
            }
          } catch (err) {
            if (isMounted.current) {
              Alert.alert(t.common.error, t.errors.authFailed);
            }
          } finally {
            if (isMounted.current) {
              navigationInProgress.current = false;
            }
          }
        }
      });

      authManager.setAuthUnsubscribe(unsubscribe);
    };
    
    setupAuthListener();
    
    return () => {
      isMounted.current = false;
      if (unsubscribe) {
        unsubscribe();
        authManager.decrementListenerCount();
      }
    };
  }, [mode, t]);

  const handleAuth = async () => {
    if (!email || !password) {
        setError(t.errors.fillAllFields);
        return;
    }

    if (mode === 'signup') {
        if (password !== confirmPassword) {
            setError(t.errors.passwordsNoMatch);
            return;
        }
        if (password.length < 6) {
            setError(t.errors.weakPassword);
            return;
        }
    }

    setIsLoading(true);
    setError(null);
    navigationInProgress.current = false;
    
    // Set auth in progress before starting
    authManager.setAuthInProgress(true);

    try {
        if (mode === 'signin') {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
        }
    } catch (err: any) {
        console.log(err);
        setError(getErrorMessage(err.code, t));
        authManager.setProcessing(false);
    } finally {
        if (isMounted.current) {
            setIsLoading(false);
            authManager.setAuthInProgress(false);
        }
    }
};

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ backgroundColor: colors.background }}
      className="flex-1"
    >
      <Loader isLoading={isLoading} />
      
      <View className="flex-1 justify-between p-6">
        <View className="mt-8 items-center">
          <ThemedText 
            variant="primary" 
            className="text-4xl font-pextrabold mb-2"
            isRTL={isRTL}
          >
            {mode === 'signin' ? t.auth.welcomeBack : t.auth.createAccount}
          </ThemedText>
          <ThemedText 
            variant="secondary" 
            className="font-pregular text-xl mb-4"
            isRTL={isRTL}
          >
            {mode === 'signin' ? t.auth.signInContinue : t.auth.beginJourney}
          </ThemedText>
        </View>

        <View className="w-full">
          <CustomInput
            value={email}
            onChangeText={(text: string) => {
              setEmail(text);
              setError(null);
            }}
            placeholder={t.auth.emailPlaceholder}
            keyboardType="email-address"
            isRTL={isRTL}
          />
          <CustomInput
            value={password}
            onChangeText={(text: string) => {
              setPassword(text);
              setError(null);
            }}
            placeholder={t.auth.passwordPlaceholder}
            isPassword
            isRTL={isRTL}
          />
          
          {mode === 'signup' && (
            <CustomInput
              value={confirmPassword}
              onChangeText={(text: string) => {
                setConfirmPassword(text);
                setError(null);
              }}
              placeholder={t.auth.confirmPasswordPlaceholder}
              isPassword
              isRTL={isRTL}
            />
          )}
          
          {error && (
            <ThemedText 
              variant="error" 
              className="mb-4 text-center font-pmedium"
            >
              {error}
            </ThemedText>
          )}

          <View className="space-y-4">
            <CustomButton
              title={mode === 'signin' ? t.auth.signIn : t.auth.createAccount}
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
                <ThemedText 
                  variant="primary" 
                  className="text-center font-pmedium text-lg"
                >
                  {mode === 'signin' ? t.auth.noAccount : t.auth.haveAccount}
                </ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <View className="mb-6">
          <ThemedText 
            variant="secondary" 
            className="text-center font-plight text-sm"
          >
            {t.auth.termsNotice}
          </ThemedText>
        </View>
      </View>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default AuthScreen;