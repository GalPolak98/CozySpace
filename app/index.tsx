import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-green-500">Test.</Text>
      <Link href={"/(tabs)/home"} className="text-blue-500">here sign in</Link>
    </View>
  );
}
