import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { List, Avatar, Badge, Text, Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import apiClient from '../../src/config/api';

interface Conversation {
  userId: string;
  user: {
    id: string;
    email: string;
    role: string;
    student?: {
      firstName: string;
      lastName: string;
    };
    faculty?: {
      firstName: string;
      lastName: string;
    };
  };
  lastMessage: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
}

export default function Messages() {
  const router = useRouter();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/messages/conversations');
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const getDisplayName = (conversation: Conversation) => {
    const { student, faculty } = conversation.user;
    if (student) {
      return `${student.firstName} ${student.lastName}`;
    }
    if (faculty) {
      return `${faculty.firstName} ${faculty.lastName}`;
    }
    return conversation.user.email;
  };

  const getInitials = (conversation: Conversation) => {
    const name = getDisplayName(conversation);
    const parts = name.split(' ');
    return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter((conv) =>
    getDisplayName(conv).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConversation = ({ item }: { item: Conversation }) => {
    return (
      <List.Item
        title={getDisplayName(item)}
        description={item.lastMessage.content}
        descriptionNumberOfLines={1}
        left={() => (
          <Avatar.Text
            size={48}
            label={getInitials(item)}
            style={styles.avatar}
          />
        )}
        right={() => (
          <View style={styles.rightContent}>
            <Text style={styles.timeText}>
              {formatTime(item.lastMessage.createdAt)}
            </Text>
            {item.unreadCount > 0 && (
              <Badge style={styles.badge}>{item.unreadCount}</Badge>
            )}
          </View>
        )}
        onPress={() => {
          // Navigate to chat screen (to be implemented)
          console.log('Open chat with:', item.userId);
        }}
        style={styles.listItem}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search conversations..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.userId}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="message-off" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>
              Start a conversation with your faculty or classmates
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 10,
    elevation: 2,
  },
  listItem: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    backgroundColor: '#1976d2',
    marginLeft: 10,
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 10,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  badge: {
    backgroundColor: '#f44336',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
  },
});
