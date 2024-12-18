import React from 'react';
import { Stack } from 'expo-router';
import { StyleSheet, FlatList, TouchableOpacity, View } from 'react-native';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeContext';

interface Note {
  _id: string;
  date: string;
  content: string;
  timestamp?: string;
}

interface NotesLayoutProps {
  notes: Note[];
  children: React.ReactNode;
}

export function NotesList({ notes }: { notes: Note[] }) {
  const { theme } = useTheme();

  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={[
        styles.noteCard,
        {
          backgroundColor: theme === 'dark' ? '#2A2A2A' : '#fff',
          borderLeftColor: theme === 'dark' ? '#4A90E2' : '#2196F3',
        },
      ]}
    >
      <View style={styles.noteHeader}>
        <View style={styles.dateContainer}>
          <MaterialIcons
            name="event"
            size={18}
            color={theme === 'dark' ? '#4A90E2' : '#2196F3'}
            style={styles.dateIcon}
          />
          <ThemedText style={[styles.noteDate, { color: theme === 'dark' ? '#fff' : '#000' }]}>
            {item.date}
          </ThemedText>
        </View>
        <MaterialIcons
          name="more-vert"
          size={20}
          color={theme === 'dark' ? '#999' : '#666'}
        />
      </View>

      <ThemedText style={[styles.noteContent, { color: theme === 'dark' ? '#ccc' : '#555' }]}>
        {item.content}
      </ThemedText>

      <View style={styles.noteFooter}>
        <View style={styles.timestampContainer}>
          <MaterialIcons
            name="access-time"
            size={14}
            color={theme === 'dark' ? '#999' : '#666'}
            style={styles.timeIcon}
          />
          <ThemedText style={[styles.timestampText, { color: theme === 'dark' ? '#999' : '#666' }]}>
            {item.timestamp}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => item._id}
      renderItem={renderNote}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

export default function NotesLayout() {
  const { theme } = useTheme();

  return (
    <>
      <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // Hides the header completely
          // Alternatively, you can provide an empty title if needed
          // title: '',
        }}
      />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    marginLeft: 8,
    fontSize: 14,
  },
  list: {
    paddingBottom: 20,
  },
  noteCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 6,
  },
  noteDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: 4,
  },
  timestampText: {
    fontSize: 12,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
});