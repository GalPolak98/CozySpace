import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/components/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { theme } from "@/styles/Theme";
import { CustomCheckbox } from "@/components/CustomCheckbox";

interface FeatureOptionProps {
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
  isRTL?: boolean;
}

export const FeatureOption: React.FC<FeatureOptionProps> = ({
  title,
  description,
  isEnabled,
  onToggle,
  iconName,
  isRTL = false,
}) => {
  const { theme: currentTheme } = useTheme();
  const { t } = useLanguage();
  const colors = theme[currentTheme];

  const createShadowStyle = (color: string): ViewStyle => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  });

  return (
    <TouchableOpacity
      onPress={onToggle}
      className="bg-surface rounded-s"
      style={{
        ...createShadowStyle(colors.text),
        backgroundColor: colors.surface,
      }}
    >
      <View
        className="p-4"
        style={{
          borderRightWidth: isRTL ? 4 : 0,
          borderLeftWidth: isRTL ? 0 : 4,
          borderColor: isEnabled ? colors.primary : "transparent",
        }}
      >
        <View
          className="items-start justify-between mb-3"
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
          }}
        >
          <View
            className="flex-1"
            style={{
              alignItems: isRTL ? "flex-end" : "flex-start",
            }}
          >
            <Text
              style={{
                color: colors.text,
                textAlign: isRTL ? "right" : "left",
              }}
              className="text-lg font-pbold mb-1"
            >
              {title}
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                textAlign: isRTL ? "right" : "left",
              }}
              className="text-sm font-pregular"
            >
              {description}
            </Text>
          </View>
          <Ionicons
            name={iconName}
            size={24}
            color={isEnabled ? colors.primary : colors.text}
            style={{
              marginLeft: isRTL ? 0 : 12,
              marginRight: isRTL ? 12 : 0,
            }}
          />
        </View>

        <View
          className="items-center mt-2"
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
          }}
        >
          <CustomCheckbox
            checked={isEnabled}
            onCheckedChange={onToggle}
            size="medium"
          />
          <Text
            style={{
              color: isEnabled ? colors.primary : colors.text,
              marginLeft: isRTL ? 0 : 12,
              marginRight: isRTL ? 12 : 0,
            }}
            className="font-pmedium"
          >
            {isEnabled ? t.common.enabled : t.common.enable}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
