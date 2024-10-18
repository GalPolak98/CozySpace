import CustomButton from "../components/CustomButton";
import { router } from "expo-router";
import React from "react";
import { View} from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <CustomButton
            title="Get started here!"
            handlePress={() => router.push({
              pathname: '/(auth)/sign-in',
            })}
            containerStyles="w-full mt-7"
            isLoading = {false} //TO DO: later
          />
    </View>
  );
}
