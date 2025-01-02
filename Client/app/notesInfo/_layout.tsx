import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View } from 'react-native';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/components/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

// Change this to export the interface
export interface Note {
  _id: string;
  date: string;
  content: string;
  timestamp?: string;
}

export interface NotesListProps {
  notes: Note[];
  onNotePress: (note: Note) => void;
}

export function NotesList({ notes, onNotePress }: NotesListProps) {
  const { theme } = useTheme();
  const { isRTL, t } = useLanguage();

  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={[
        styles.noteCard,
        {
          backgroundColor: theme === 'dark' ? '#2A2A2A' : '#fff',
          borderLeftColor: theme === 'dark' ? '#4A90E2' : '#2196F3',
        },
      ]}
      onPress={() => onNotePress(item)}
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
    <View style={styles.container}>
      {notes.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <ThemedText style={[styles.emptyStateText, { color: theme === 'dark' ? '#aaa' : '#666' }]}>
          {t.note.noNotesMessage}
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item._id}
          renderItem={renderNote}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  emptyStateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
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
});