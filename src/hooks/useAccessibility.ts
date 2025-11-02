import { useState, useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';

export interface AccessibilitySettings {
  isScreenReaderEnabled: boolean;
  preferredFontScale: number;
  isReduceMotionEnabled: boolean;
}

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    isScreenReaderEnabled: false,
    preferredFontScale: 1,
    isReduceMotionEnabled: false,
  });

  useEffect(() => {
    // Vérifier si le lecteur d'écran est activé
    AccessibilityInfo.isScreenReaderEnabled().then(isEnabled => {
      setSettings(prev => ({ ...prev, isScreenReaderEnabled: isEnabled }));
    });

    // Écouter les changements
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      isEnabled => {
        setSettings(prev => ({ ...prev, isScreenReaderEnabled: isEnabled }));
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return settings;
};

