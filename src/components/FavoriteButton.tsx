import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
  size?: number;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  isFavorite, 
  onPress,
  size = 24 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const useNative = Platform.OS !== 'web';
    if (isFavorite) {
      // Animation de "battement" quand on ajoute aux favoris
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.3,
            friction: 3,
            useNativeDriver: useNative,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: useNative,
          }),
        ]),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          useNativeDriver: useNative,
        }),
      ]).start();
    } else {
      // Animation de retour à la normale
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: useNative,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: useNative,
        }),
      ]).start();
    }
  }, [isFavorite]);

  const handlePress = () => {
    // Animation au clic
    const useNative = Platform.OS !== 'web';
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: useNative,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: useNative,
      }),
    ]).start();

    onPress();
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={styles.button}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [
              { scale: scaleAnim },
              { rotate: rotation },
            ],
          },
        ]}
      >
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={size}
          color={isFavorite ? COLORS.error : COLORS.textSecondary}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FavoriteButton;








