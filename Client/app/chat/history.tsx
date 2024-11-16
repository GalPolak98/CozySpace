import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { ChatSession } from '@/types/chat';
import { useChatContext } from '@/context/ChatContext';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';

const ChatHistory = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const { getAllSessions, setCurrentSession, deleteSession } = useChatContext();
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];
  const router = useRouter();

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
      'Delete Chat',
      'Are you sure you want to delete this chat?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
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
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderSessionItem = useCallback(({ item }: { item: ChatSession }) => (
    <TouchableOpacity
      style={[styles.sessionItem, { backgroundColor: colors.surface }]}
      onPress={() => handleSessionPress(item)}
    >
      <View style={styles.sessionContent}>
        <ThemedText style={styles.dateText}>
          {formatDate(item.createdAt)}
        </ThemedText>
        <ThemedText style={styles.messagePreview} numberOfLines={2}>
          {item.messages[item.messages.length - 1]?.text || 'No messages'}
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
  ), [colors, handleSessionPress, handleDeleteSession]);

  const keyExtractor = useCallback((item: ChatSession) => item.id, []);

  return (
    <ThemedView style={styles.container}>
      {sessions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            No chat history yet
          </ThemedText>
        </View>
      ) : (
        <FlashList
          data={sessions}
          estimatedItemSize={80}
          renderItem={renderSessionItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          extraData={currentTheme}
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
    flexDirection: 'row',
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
    marginRight: 16,
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