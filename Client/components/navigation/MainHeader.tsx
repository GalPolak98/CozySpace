import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/components/ThemeContext";
import { theme } from "@/styles/Theme";
import { HeaderRight } from "@/components/navigation/HeaderButtons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";

const MainHeader = () => {
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const insets = useSafeAreaInsets();

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
      <ThemedView style={styles.headerContent}>
        <ThemedView style={styles.leftContainer} />

        <ThemedView style={styles.titleContainer}>
          <ThemedText style={[styles.title, { color: colors.text }]}>
            CozySpace
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.rightContainer}>
          <HeaderRight />
        </ThemedView>
      </ThemedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
  },
  headerContent: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  leftContainer: {
    width: 80,
  },
  titleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
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

export default MainHeader;
