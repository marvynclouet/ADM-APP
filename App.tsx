import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/components/SplashScreen';
import { COLORS } from './src/constants/colors';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Configuration du viewport pour éviter le zoom automatique sur mobile web
    if (Platform.OS === 'web') {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
      } else {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        document.getElementsByTagName('head')[0].appendChild(meta);
      }
    }

    // Simuler le chargement de l'app (initialisation, données, etc.)
    const loadApp = async () => {
      // Ici on pourrait charger des données, vérifier l'auth, etc.
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
    };

    loadApp();
  }, []);

  if (isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" backgroundColor={COLORS.primary} />
        <SplashScreen 
          onFinish={() => setIsLoading(false)}
          duration={2000}
        />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <AppNavigator />
    </GestureHandlerRootView>
  );
}
