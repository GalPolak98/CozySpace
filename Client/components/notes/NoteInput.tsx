import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Dimensions, 
  TextStyle, 
  ScrollView, 
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import ThemedView from '@/components/ThemedView';
import { theme } from '@/styles/Theme';
import { useUserData } from '@/hooks/useUserData';
import useAuth from '@/hooks/useAuth';

interface NotebookInputProps {
  note: string;
  setNote: (note: string) => void;
}

const NotebookInput: React.FC<NotebookInputProps> = ({ note, setNote }) => {
  const { t, isRTL, getGenderedText} = useLanguage();
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const [contentHeight, setContentHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const userId = useAuth();
  const {
    gender,
  } = useUserData(userId);
  
  const LINE_HEIGHT = Platform.select({ ios: 30, android: 35 });
  const PADDING_TOP = 10;
  const PADDING_HORIZONTAL = 20;
  const MIN_HEIGHT = Dimensions.get('window').height * 0.5;
  const MAX_HEIGHT = Dimensions.get('window').height * 0.5;
  
  const numberOfLines = Math.max(
    Math.ceil((contentHeight + PADDING_TOP) / (LINE_HEIGHT || 30)),
    Math.ceil(MIN_HEIGHT / (LINE_HEIGHT || 30))
  );

  const NotebookLines: React.FC = () => (
    <View
      style={[
        styles.linesContainer,
        {
          height: Math.max(contentHeight + PADDING_TOP * 2, MIN_HEIGHT),
        }
      ]}
      pointerEvents="none"
    >
      {[...Array(numberOfLines)].map((_, i) => (
        <View
          key={i}
          style={[
            styles.line,
            {
              top: PADDING_TOP + (LINE_HEIGHT || 30) * (i + 1),
              backgroundColor: colors.placeholder,
            }
          ]}
        />
      ))}
    </View>
  );

  const handleContentSizeChange = (width: number, height: number) => {
    setContentHeight(height);
    // Scroll to bottom when content size changes
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const inputStyle: TextStyle = {
    minHeight: MIN_HEIGHT,
    padding: PADDING_HORIZONTAL,
    paddingTop: PADDING_TOP,
    backgroundColor: 'transparent',
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    textAlign: isRTL ? 'right' : 'left',
    writingDirection: isRTL ? 'rtl' : 'ltr',
    lineHeight: LINE_HEIGHT,
    ...Platform.select({
      android: {
        textAlignVertical: 'top',
      }
    })
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <ThemedView style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          style={{ maxHeight: MAX_HEIGHT }}
          showsVerticalScrollIndicator={true}
          scrollEnabled={true}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
        >
          <View style={styles.contentWrapper}>
            <NotebookLines />
            <TextInput
              ref={inputRef}
              style={inputStyle}
              placeholder={getGenderedText(t.note.placeholder, gender as string)}
              placeholderTextColor={colors.textSecondary}
              value={note}
              onChangeText={(text) => {
                setNote(text);
                // Ensure scroll to bottom happens after text update
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }}
              multiline
              scrollEnabled={true}
              textAlignVertical="top"
              onContentSizeChange={(e) => 
                handleContentSizeChange(
                  e.nativeEvent.contentSize.width,
                  e.nativeEvent.contentSize.height
                )
              }
            />
          </View>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginBottom: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  contentWrapper: {
    position: 'relative',
  },
  linesContainer: {
    position: 'absolute',
    width: '100%',
    pointerEvents: 'none',
  },
  line: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 1,
    opacity: 0.3,
  },
});

export default NotebookInput;