import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '../constants/colors';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true }) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { width: 40, height: 40, fontSize: 12 };
      case 'large':
        return { width: 100, height: 100, fontSize: 18 };
      default:
        return { width: 60, height: 60, fontSize: 14 };
    }
  };

  const { width, height, fontSize } = getSize();

  return (
    <View style={styles.container}>
      <View style={[styles.logoContainer, { width, height }]}>
        <Image
          source={require('../assets/images/Logo ADM V1.png')}
          style={[styles.logo, { width: width, height: height }]}
          resizeMode="cover"
        />
      </View>
      {showText && (
        <Text style={[styles.logoText, { fontSize }]}>ADM</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  logo: {
    borderRadius: 30, // Bordure ronde pour masquer le fond blanc
  },
  logoText: {
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 2,
  },
});

export default Logo; 