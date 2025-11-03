import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface MessagesScreenProps {
  navigation?: any;
}

interface Conversation {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isFromProvider: boolean;
  isRead: boolean;
}

const MessagesScreen: React.FC<MessagesScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread' | 'bookings'>('all');

  const conversations: Conversation[] = [
    {
      id: '1',
      providerId: '1',
      providerName: 'Sophie Martin',
      providerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie&backgroundColor=b6e3f4',
      lastMessage: 'Parfait ! Je vous confirme votre rendez-vous pour demain à 14h.',
      lastMessageTime: 'Il y a 2h',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      providerId: '2',
      providerName: 'Marie Dupont',
      providerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie&backgroundColor=b6e3f4',
      lastMessage: 'Bonjour, avez-vous des disponibilités cette semaine ?',
      lastMessageTime: 'Hier',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '3',
      providerId: '3',
      providerName: 'Julie Bernard',
      providerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julie&backgroundColor=b6e3f4',
      lastMessage: 'Merci pour votre réservation ! À bientôt.',
      lastMessageTime: 'Il y a 3j',
      unreadCount: 0,
      isOnline: true
    }
  ];

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (selectedTab) {
      case 'unread':
        return matchesSearch && conversation.unreadCount > 0;
      case 'bookings':
        return matchesSearch && conversation.lastMessage.includes('réservation');
      default:
        return matchesSearch;
    }
  });

  const handleConversationPress = (conversation: Conversation) => {
    if (navigation) {
      navigation.navigate('Chat', { 
        conversationId: conversation.id,
        providerName: conversation.providerName,
        providerAvatar: conversation.providerAvatar
      });
    } else {
      Alert.alert('Chat', `Ouvrir la conversation avec ${conversation.providerName}`);
    }
  };

  const handleNewMessage = () => {
    if (navigation) {
      navigation.navigate('SelectProvider');
    } else {
      Alert.alert('Nouveau message', 'Fonctionnalité à venir');
    }
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.conversationCard}
      onPress={() => handleConversationPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.conversationHeader}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.providerAvatar }} style={styles.avatar} />
          {item.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.conversationInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.providerName}>{item.providerName}</Text>
            <Text style={styles.timeText}>{item.lastMessageTime}</Text>
          </View>
          <View style={styles.messageRow}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.newMessageButton} onPress={handleNewMessage}>
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'all' && styles.tabButtonActive]}
            onPress={() => setSelectedTab('all')}
          >
            <Text style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>
              Toutes ({conversations.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'unread' && styles.tabButtonActive]}
            onPress={() => setSelectedTab('unread')}
          >
            <Text style={[styles.tabText, selectedTab === 'unread' && styles.tabTextActive]}>
              Non lus ({conversations.filter(c => c.unreadCount > 0).length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === 'bookings' && styles.tabButtonActive]}
            onPress={() => setSelectedTab('bookings')}
          >
            <Text style={[styles.tabText, selectedTab === 'bookings' && styles.tabTextActive]}>
              Réservations
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Conversations List */}
      {filteredConversations.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubble-outline" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyStateTitle}>Aucune conversation</Text>
          <Text style={styles.emptyStateText}>
            {selectedTab === 'unread' 
              ? 'Vous n\'avez pas de messages non lus'
              : selectedTab === 'bookings'
              ? 'Aucune conversation liée à une réservation'
              : 'Commencez une conversation avec un prestataire'
            }
          </Text>
          <TouchableOpacity style={styles.startChatButton} onPress={handleNewMessage}>
            <Text style={styles.startChatButtonText}>Nouveau message</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.conversationsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  newMessageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  tabsContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 8,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  conversationsList: {
    paddingVertical: 8,
  },
  conversationCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  conversationInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  startChatButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  startChatButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default MessagesScreen; 