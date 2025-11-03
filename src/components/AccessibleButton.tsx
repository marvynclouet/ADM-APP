import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AccessibleText from './AccessibleText';
import { COLORS } from '../constants/colors';
import { createAccessibleStyles } from '../utils/accessibility';

interface AccessibleButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  style,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? COLORS.lightGray : COLORS.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? COLORS.lightGray : COLORS.secondary,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: disabled ? COLORS.lightGray : COLORS.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16, minHeight: 36 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 32, minHeight: 52 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24, minHeight: 44 };
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.textSecondary;
    if (variant === 'outline' || variant === 'ghost') return COLORS.primary;
    return COLORS.white;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        createAccessibleStyles({}),
        getVariantStyles(),
        getSizeStyles(),
        fullWidth && styles.fullWidth,
        style,
      ]}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon as any}
              size={20}
              color={getTextColor()}
              style={styles.iconLeft}
            />
          )}
          <AccessibleText
            variant="body"
            style={[styles.text, { color: getTextColor() }]}
          >
            {title}
          </AccessibleText>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon as any}
              size={20}
              color={getTextColor()}
              style={styles.iconRight}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default AccessibleButton;


