import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Href } from "expo-router";
import { useTheme } from "@/components/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { theme } from "@/styles/Theme";
import ThemedText from "@/components/ThemedText";
import { HeaderRight } from "@/components/navigation/HeaderButtons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface GenericHeaderProps {
  title: string;
  backPath?: Href;
  toggleTheme?: () => void;
  rightComponent?: React.ReactNode;
  onBackPress?: () => void;
}

const GenericHeader: React.FC<GenericHeaderProps> = ({
  title,
  backPath = "/(patient)/home",
  toggleTheme,
  rightComponent,
  onBackPress,
}) => {
  const { theme: currentTheme } = useTheme();
  const { isRTL } = useLanguage();
  const router = useRouter();
  const colors = theme[currentTheme];
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.replace(backPath);
    }
  };

  return (
    <View
      style={[
        {
          backgroundColor: colors.header,
          paddingTop: insets.top,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name={"chevron-back"} size={28} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
        </View>

        <View style={styles.rightContainer}>
          {rightComponent || <HeaderRight />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  leftContainer: {
    width: 40,
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
  },
  rightContainer: {
    width: 40,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default GenericHeader;
