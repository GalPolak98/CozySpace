import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import CustomButton from '../CustomButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SubmitButtonProps {
  onPress: () => void;
  style?: string; 
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onPress, style = '' }) => {
  const { t, isRTL } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ marginBottom: insets.bottom }} 
>
    <CustomButton
      title={t.common.submit}
      handlePress={onPress}
      containerStyles={`${style}`} 
      variant="primary"
      isLoading={false}
      isRTL={isRTL}
    />
    </View>
  );
};

export default SubmitButton;