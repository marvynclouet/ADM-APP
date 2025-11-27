import React from 'react';
import { Text, TextProps, StyleSheet, useColorScheme } from 'react-native';
import { COLORS } from '../constants/colors';
import { useAccessibility } from '../hooks/useAccessibility';
import { getScaledFontSize } from '../utils/accessibility';

interface AccessibleTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  accessible?: boolean;
  accessibilityLabel?: string;
}

const AccessibleText: React.FC<AccessibleTextProps> = ({
  variant = 'body',
  style,
  accessible = true,
  accessibilityLabel,
  ...props
}) => {
  const { preferredFontScale } = useAccessibility();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getVariantStyle = () => {
    const baseSizes = {
      h1: 28,
      h2: 24,
      h3: 20,
      body: 16,
      caption: 12,
    };

    return {
      fontSize: getScaledFontSize(baseSizes[variant], preferredFontScale),
      fontWeight: variant === 'h1' || variant === 'h2' ? 'bold' : 'normal',
      color: isDark ? COLORS.white : COLORS.textPrimary,
      lineHeight: getScaledFontSize(baseSizes[variant] * 1.5, preferredFontScale),
    };
  };

  return (
    <Text
      style={[getVariantStyle(), style]}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel || props.children?.toString()}
      {...props}
    />
  );
};

export default AccessibleText;





