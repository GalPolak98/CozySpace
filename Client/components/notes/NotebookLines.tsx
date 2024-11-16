// NotebookLines.tsx
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import ThemedView from '@/components/ThemedView';
import ThemedText from '@/components/ThemedText';

const NotebookLines: React.FC = () => {
  const LINE_HEIGHT = 25;
  const CONTAINER_HEIGHT = 470;
  const NUMBER_OF_LINES = Math.floor(CONTAINER_HEIGHT / LINE_HEIGHT);
  
  return (
    <>
      {[...Array(NUMBER_OF_LINES)].map((_, i) => (
        i !== 0 && i !== 1 && (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: i * LINE_HEIGHT + i * 2,
              height: 1,
              backgroundColor: 'rgba(56, 189, 248, 0.4)', // Light Blue Line
            }}
          />
        )
      ))}
    </>
  );
};

export default NotebookLines;
