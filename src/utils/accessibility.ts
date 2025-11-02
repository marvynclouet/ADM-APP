import { Platform } from 'react-native';

/**
 * Calcule la taille de police en fonction du scale d'accessibilité
 */
export const getScaledFontSize = (baseSize: number, scale: number = 1): number => {
  // Limiter le scale entre 0.8 et 2.0 pour éviter les problèmes de layout
  const clampedScale = Math.max(0.8, Math.min(2.0, scale));
  return Math.round(baseSize * clampedScale);
};

/**
 * Vérifie si le contraste entre deux couleurs est suffisant (WCAG AA)
 */
export const checkContrast = (foreground: string, background: string): boolean => {
  // Conversion simplifiée RGB to luminance
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Relative luminance
    const [rLinear, gLinear, bLinear] = [r, g, b].map(val => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  };

  const lum1 = getLuminance(foreground);
  const lum2 = getLuminance(background);

  const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
  
  // WCAG AA requires 4.5:1 for normal text
  return ratio >= 4.5;
};

/**
 * Génère une couleur avec un contraste suffisant
 */
export const getAccessibleColor = (
  baseColor: string,
  backgroundColor: string,
  fallbackColor: string
): string => {
  return checkContrast(baseColor, backgroundColor) ? baseColor : fallbackColor;
};

/**
 * Crée des styles accessibles avec support du clavier
 */
export const createAccessibleStyles = (baseStyles: any) => {
  return {
    ...baseStyles,
    // Augmenter les zones de touch pour l'accessibilité
    minHeight: Platform.select({
      ios: 44,
      android: 48,
      default: 40,
    }),
    minWidth: Platform.select({
      ios: 44,
      android: 48,
      default: 40,
    }),
  };
};

