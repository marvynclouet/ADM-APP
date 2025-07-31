import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface ChatScreenProps {
  navigation?: any;
  route?: any;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isFromProvider: boolean;
  isRead: boolean;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Comment puis-je vous aider ?',
      timestamp: '14:30',
      isFromProvider: true,
      isRead: true
    },
    {
      id: '2',
      text: 'Bonjour ! J\'aimerais prendre rendez-vous pour une coupe de cheveux.',
      timestamp: '14:32',
      isFromProvider: false,
      isRead: true
    },
    {
      id: '3',
      text: 'Parfait ! J\'ai des disponibilités demain à 14h ou 16h. Qu\'est-ce qui vous convient ?',
      timestamp: '14:33',
      isFromProvider: true,
      isRead: true
    },
    {
      id: '4',
      text: '14h me convient parfaitement !',
      timestamp: '14:35',
      isFromProvider: false,
      isRead: true
    },
    {
      id: '5',
      text: 'Excellent ! Je vous confirme votre rendez-vous pour demain à 14h. À bientôt !',
      timestamp: '14:36',
      isFromProvider: true,
      isRead: false
    }
  ]);

  const flatListRef = useRef<FlatList>(null);
  const { providerName, providerAvatar } = route?.params || {};

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isFromProvider: false,
        isRead: false
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      // Simulate provider response
      setTimeout(() => {
        const providerResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Merci pour votre message ! Je vous réponds dans quelques instants.',
          timestamp: new Date().toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          isFromProvider: true,
          isRead: false
        };
        setMessages(prev => [...prev, providerResponse]);
      }, 2000);
    }
  };

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  const handleCall = () => {
    Alert.alert('Appel', 'Fonctionnalité d\'appel à venir');
  };

  const handleVideoCall = () => {
    Alert.alert('Appel vidéo', 'Fonctionnalité d\'appel vidéo à venir');
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isFromProvider ? styles.providerMessage : styles.clientMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.isFromProvider ? styles.providerBubble : styles.clientBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isFromProvider ? styles.providerText : styles.clientText
        ]}>
          {item.text}
        </Text>
        <View style={styles.messageFooter}>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
          {!item.isFromProvider && (
            <Ionicons 
              name={item.isRead ? "checkmark-done" : "checkmark"} 
              size={16} 
              color={item.isRead ? COLORS.primary : COLORS.textSecondary} 
            />
          )}
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Image source={{ uri: providerAvatar }} style={styles.headerAvatar} />
          <View style={styles.headerText}>
            <Text style={styles.headerName}>{providerName}</Text>
            <Text style={styles.headerStatus}>En ligne</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Ionicons name="call" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleVideoCall}>
            <Ionicons name="videocam" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Tapez votre message..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !message.trim() && styles.sendButtonDisabled
            ]} 
            onPress={handleSendMessage}
            disabled={!message.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={message.trim() ? COLORS.white : COLORS.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  headerStatus: {
    fontSize: 12,
    color: COLORS.success,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  providerMessage: {
    alignItems: 'flex-start',
  },
  clientMessage: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  providerBubble: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
  },
  clientBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  providerText: {
    color: COLORS.textPrimary,
  },
  clientText: {
    color: COLORS.white,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginRight: 4,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.background,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.border,
  },
});

export default ChatScreen; 