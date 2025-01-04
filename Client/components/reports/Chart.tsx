import React, { useEffect, useState } from "react";
import { Dimensions, View, LayoutChangeEvent } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useTheme } from "../ThemeContext";
import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";
import { useLanguage } from "@/context/LanguageContext";
import { theme } from "@/styles/Theme";

interface ChartProps {
  weeklyData: any;
}

const Chart: React.FC<ChartProps> = ({ weeklyData }) => {
  const { theme: currentTheme } = useTheme();
  const isDark = currentTheme === "dark";
  const { t, isRTL } = useLanguage();
  const [containerWidth, setContainerWidth] = useState(0);
  const colors = theme[currentTheme];

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const chartConfig = {
    backgroundColor: colors.background,
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    color: (opacity = 1) =>
      isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 10,
      fontFamily: "Poppins-Medium",
    },
    propsForBackgroundLines: {
      strokeDasharray: "4 4",
      strokeWidth: 1,
      stroke: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    },
    propsForDots: {
      r: "3",
      strokeWidth: "1.5",
      stroke: colors.primary,
    },
  };

  return (
    <ThemedView
      className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4"
      style={{
        borderWidth: 1,
        borderColor: colors.border,
      }}
      onLayout={onLayout}
    >
      <ThemedText
        className="font-pbold text-base mb-3 w-full"
        style={{
          textAlign: isRTL ? "right" : "left",
          color: colors.text,
        }}
      >
        {t.reports.anxietyEvents}
      </ThemedText>

      {containerWidth > 0 && (
        <View style={{ 
          flex: 1,
          justifyContent: 'center',  
          alignItems: 'flex-end', 
        }}>
          <LineChart
            data={weeklyData}
            width={containerWidth - 32}  
            height={280}
            chartConfig={chartConfig}
            bezier
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={true}
            withHorizontalLabels={true}
            withVerticalLabels={true}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero
            segments={4}
            style={{
              marginHorizontal: 16, 
            }}
          />
        </View>
      )}
    </ThemedView>
  );
};

export default Chart;
