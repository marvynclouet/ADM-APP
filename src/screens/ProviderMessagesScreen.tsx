import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';

interface ProviderMessagesScreenProps {
  navigation?: any;
}

const ProviderMessagesScreen: React.FC<ProviderMessagesScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread' | 'bookings'>('all');

  const conversations = [
    {
      id: '1',
      clientName: 'Marie Dupont',
      clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie&backgroundColor=b6e3f4',
      lastMessage: 'Bonjour, je voudrais confirmer mon rendez-vous de demain',
      time: '14:30',
      unread: true,
      bookingId: 'BK001',
      service: 'Manucure'
    },
    {
      id: '2',
      clientName: 'Julie Martin',
      clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julie&backgroundColor=b6e3f4',
      lastMessage: 'Merci pour le service, c\'était parfait !',
      time: '12:15',
      unread: false,
      bookingId: 'BK002',
      service: 'Coiffure'
    },
    {
      id: '3',
      clientName: 'Sarah Bernard',
      clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4',
      lastMessage: 'Pouvez-vous me rappeler l\'adresse ?',
      time: '09:45',
      unread: true,
      bookingId: 'BK003',
      service: 'Massage'
    },
    {
      id: '4',
      clientName: 'Emma Wilson',
      clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=b6e3f4',
      lastMessage: 'Je serai en retard de 10 minutes',
      time: 'Hier',
      unread: false,
      bookingId: 'BK004',
      service: 'Manucure'
    }
  ];

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === 'unread') {
      return matchesSearch && conversation.unread;
    } else if (selectedTab === 'bookings') {
      return matchesSearch && conversation.bookingId;
    }
    
    return matchesSearch;
  });

  const handleConversationPress = (conversation: any) => {
    Alert.alert(
      'Conversation',
      `Ouvrir la conversation avec ${conversation.clientName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Ouvrir', 
          onPress: () => {
            Alert.alert('Chat', `Chat avec ${conversation.clientName}\nService: ${conversation.service}\nRéservation: ${conversation.bookingId}`);
          }
        }
      ]
    );
  };

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.gradientStart, COLORS.gradientEnd]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher dans les messages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Onglets */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'all' && styles.tabActive]}
          onPress={() => setSelectedTab('all')}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>Tous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'unread' && styles.tabActive]}
          onPress={() => setSelectedTab('unread')}
        >
          <View style={styles.tabWithBadge}>
            <Text style={[styles.tabText, selectedTab === 'unread' && styles.tabTextActive]}>Non lus</Text>
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{conversations.filter(c => c.unread).length}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'bookings' && styles.tabActive]}
          onPress={() => setSelectedTab('bookings')}
        >
          <Text style={[styles.tabText, selectedTab === 'bookings' && styles.tabTextActive]}>Réservations</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des conversations */}
      <ScrollView style={styles.conversationsList} showsVerticalScrollIndicator={false}>
        {filteredConversations.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateTitle}>Aucun message</Text>
            <Text style={styles.emptyStateText}>
              {selectedTab === 'unread' ? 'Aucun message non lu' : 
               selectedTab === 'bookings' ? 'Aucune conversation liée à une réservation' :
               'Aucune conversation trouvée'}
            </Text>
          </View>
        ) : (
          filteredConversations.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              style={[styles.conversationCard, conversation.unread && styles.conversationCardUnread]}
              onPress={() => handleConversationPress(conversation)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: conversation.clientAvatar }} style={styles.clientAvatar} />
              <View style={styles.conversationInfo}>
                <View style={styles.conversationHeader}>
                  <Text style={styles.clientName}>{conversation.clientName}</Text>
                  <Text style={styles.messageTime}>{conversation.time}</Text>
                </View>
                <Text style={styles.serviceName}>{conversation.service}</Text>
                <Text style={[styles.lastMessage, conversation.unread && styles.lastMessageUnread]} numberOfLines={2}>
                  {conversation.lastMessage}
                </Text>
              </View>
              {conversation.unread && (
                <View style={styles.unreadIndicator}>
                  <View style={styles.unreadDot} />
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Bouton flottant pour nouveau message */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => Alert.alert('Nouveau message', 'Fonctionnalité à venir')}
      >
        <Ionicons name="add" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    backgroundColor: COLORS.lightGray,
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
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: COLORS.primary + '20',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  tabWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabBadge: {
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  conversationsList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  conversationCardUnread: {
    backgroundColor: COLORS.primary + '05',
  },
  clientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  messageTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  serviceName: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  lastMessageUnread: {
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  unreadIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
  },
});

export default ProviderMessagesScreen; 