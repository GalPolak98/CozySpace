import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Platform,
  I18nManager 
} from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { ChatSession } from '@/types/chat';
import { useChatContext } from '@/context/ChatContext';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { theme } from '@/styles/Theme';
import useAuth from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';

const ChatHistory = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const { getAllSessions, setCurrentSession, deleteSession } = useChatContext();
  const { theme: currentTheme } = useTheme();
  const { t, isRTL, currentLanguage, getGenderedText} = useLanguage();
  const colors = theme[currentTheme];
  const router = useRouter();
  const userId = useAuth();
  const { 
    gender,  
  } = useUserData(userId);
  
  const loadSessions = useCallback(async () => {
    const chatSessions = await getAllSessions();
    setSessions(chatSessions);
  }, [getAllSessions]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleSessionPress = (session: ChatSession) => {
    setCurrentSession(session);
    router.back();
  };

  const handleDeleteSession = async (sessionId: string) => {
    Alert.alert(
      getGenderedText(t.chat.deleteChat, gender as string),
      getGenderedText(t.chat.confirmDelete, gender as string),
      [
        {
          text: t.common.cancel,
          style: 'cancel'
        },
        {
          text: t.common.delete,
          style: 'destructive',
          onPress: async () => {
            await deleteSession(sessionId);
            loadSessions();
          }
        }
      ]
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(
      currentLanguage === 'he' ? 'he-IL' : 'en-US',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  };

  const renderSessionItem = useCallback(({ item }: { item: ChatSession }) => (
    <TouchableOpacity
      style={[
        styles.sessionItem, 
        { 
          backgroundColor: colors.surface,
          flexDirection: isRTL ? 'row-reverse' : 'row'
        }
      ]}
      onPress={() => handleSessionPress(item)}
    >
      <View style={[
        styles.sessionContent,
        { marginRight: isRTL ? 0 : 16, marginLeft: isRTL ? 16 : 0 }
      ]}>
        <ThemedText 
          style={[
            styles.dateText,
            { textAlign: isRTL ? 'right' : 'left' }
          ]}
          isRTL={isRTL}
        >
          {formatDate(item.createdAt)}
        </ThemedText>
        <ThemedText 
          style={[
            styles.messagePreview,
            { textAlign: isRTL ? 'right' : 'left' }
          ]}
          numberOfLines={2}
          isRTL={isRTL}
        >
          {item.messages[item.messages.length - 1]?.text || t.chat.noMessages}
        </ThemedText>
      </View>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteSession(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons 
          name="trash-outline" 
          size={24} 
          color={colors.error || '#ff4444'} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  ), [colors, handleSessionPress, handleDeleteSession, isRTL, currentLanguage]);

  const keyExtractor = useCallback((item: ChatSession) => item.id, []);

  return (
    <ThemedView style={styles.container}>
      {sessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText 
            style={styles.emptyText}
            isRTL={isRTL}
          >
            {t.chat.noChatHistory}
          </ThemedText>
        </View>
      ) : (
        <FlashList
          data={sessions}
          estimatedItemSize={80}
          renderItem={renderSessionItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          extraData={[currentTheme, isRTL]}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  sessionItem: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionContent: {
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.7,
  },
  messagePreview: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
  },
});

export default ChatHistory;