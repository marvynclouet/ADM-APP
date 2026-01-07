import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface ToastProps {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onHide: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  visible, 
  message, 
  type, 
  onHide, 
  duration = 3000 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      // Animer l'entrée
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();

      // Auto-hide après la durée spécifiée
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ]).start(() => {
      onHide();
    });
  };

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: COLORS.success, icon: 'checkmark-circle' };
      case 'error':
        return { backgroundColor: COLORS.error, icon: 'close-circle' };
      case 'warning':
        return { backgroundColor: COLORS.warning, icon: 'warning' };
      case 'info':
        return { backgroundColor: COLORS.primary, icon: 'information-circle' };
      default:
        return { backgroundColor: COLORS.primary, icon: 'information-circle' };
    }
  };

  const toastStyle = getToastStyle();

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          backgroundColor: toastStyle.backgroundColor,
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons name={toastStyle.icon as any} size={24} color={COLORS.white} />
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
          <Ionicons name="close" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
    borderRadius: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  message: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
});

export default Toast; 