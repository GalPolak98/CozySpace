// components/Chart.tsx
import React from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../ThemeContext';
import ThemedView from '../ThemedView';
import ThemedText from '../ThemedText';
import { useLanguage } from '@/context/LanguageContext';  

interface ChartProps {
  weeklyData: any;
}

const Chart: React.FC<ChartProps> = ({ weeklyData }) => {
  const { theme } = useTheme(); 
  const screenWidth = Dimensions.get('window').width;
  const isDark = theme === 'dark';
  const { t , isRTL} = useLanguage();  // Get translation function

  const chartConfig = {
    backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
    backgroundGradientFrom: isDark ? '#1a1a1a' : '#ffffff',
    backgroundGradientTo: isDark ? '#1a1a1a' : '#ffffff',
    color: (opacity = 1) => isDark 
      ? `rgba(255, 255, 255, ${opacity})`
      : `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 10,
      fontFamily: 'Poppins-Medium',
    },
    propsForBackgroundLines: {
      strokeDasharray: "4 4",
      strokeWidth: 1,
      stroke: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    },
    propsForDots: {
      r: "3",
      strokeWidth: "1.5",
      stroke: "#3b82f6"
    }
  };

  return (
    <ThemedView className="bg-white dark:bg-gray-900  rounded-lg  shadow-sm">
      <ThemedText
        className="font-pbold text-base mb-0.5"
        style={{
          textAlign: isRTL ? 'right' : 'left', // Adjust text alignment
        }}
      >
      {t.reports.weeklyAnxietyLevels}
      </ThemedText>
      <LineChart
        data={weeklyData}
        width={screenWidth - 20}
        height={280}
        chartConfig={chartConfig}
        bezier
        style={{
          borderRadius: 8,
        }}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={true}
        yAxisLabel=""
        yAxisSuffix=""
        fromZero
        segments={4}
      />
    </ThemedView>
  );
};

export default Chart;
