import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/components/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { theme } from "@/styles/Theme";
import ThemedText from "@/components/ThemedText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnimatedDots from "./AnimatedDots";
import { HeaderRight } from "@/components/navigation/HeaderButtons";

interface ChatHeaderProps {
  isTyping: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ isTyping }) => {
  const { theme: currentTheme } = useTheme();
  const { isRTL, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const colors = theme[currentTheme];
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (pathname === "/chat/history") {
      router.back();
    } else {
      router.replace("/(patient)/home");
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.header,
          paddingTop: insets.top,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={[styles.headerContent]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name={"chevron-back"} size={28} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          {pathname === "/chat/history" ? (
            <ThemedText style={styles.title} isRTL={isRTL}>
              {t.chat.titleHistory}
            </ThemedText>
          ) : (
            <View>
              <ThemedText style={styles.title} isRTL={isRTL}>
                Coral Care
              </ThemedText>
              {isTyping && (
                <View
                  style={[
                    styles.typingContainer,
                    isRTL && styles.typingContainerRTL,
                  ]}
                >
                  <ThemedText
                    style={[styles.typingText, { color: colors.textSecondary }]}
                    isRTL={isRTL}
                  >
                    {t.common.typing}
                  </ThemedText>
                  <AnimatedDots />
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.rightContainer}>
          <HeaderRight />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
  },
  headerContent: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  backButton: {
    padding: 8,
    width: 44,
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
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  typingContainerRTL: {
    flexDirection: "row-reverse",
  },
  typingText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    margin: 5,
  },
});

export default ChatHeader;
