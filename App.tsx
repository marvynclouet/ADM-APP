import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/components/SplashScreen';
import { COLORS } from './src/constants/colors';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
