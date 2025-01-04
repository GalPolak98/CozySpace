import React from "react";
import { View } from "react-native";
import { useLanguage } from "@/context/LanguageContext";
import CustomButton from "../CustomButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserData } from "@/hooks/useUserData";
import useAuth from "@/hooks/useAuth";

interface SubmitButtonProps {
  onPress: () => void;
  style?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onPress, style = "" }) => {
  const { t, isRTL, getGenderedText } = useLanguage();
  const insets = useSafeAreaInsets();
  const userId = useAuth();
  const { gender } = useUserData(userId);

  return (
    <View style={{ marginBottom: insets.bottom }}>
      <CustomButton
        title={getGenderedText(t.common.submit, gender as string)}
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
