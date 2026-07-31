import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors, Shadows } from '../constants/theme';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        isPrimary && styles.primaryButton,
        !isPrimary && !isOutline && !isDanger && styles.secondaryButton,
        isOutline && styles.outlineButton,
        isDanger && styles.dangerButton,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#18181B' : Colors.textPrimary} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.baseText,
              isPrimary && styles.primaryText,
              !isPrimary && !isOutline && styles.secondaryText,
              isOutline && styles.outlineText,
              isDanger && styles.dangerText,
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 8,
    borderWidth: 2.5,
    borderColor: '#18181B',
    ...Shadows.button,
  },
  primaryButton: {
    backgroundColor: '#FFD93D', // Canary Yellow
  },
  secondaryButton: {
    backgroundColor: '#6C5CE7', // Electric Violet
  },
  outlineButton: {
    backgroundColor: '#FFFFFF',
  },
  dangerButton: {
    backgroundColor: '#FF7675',
  },
  disabledButton: {
    opacity: 0.5,
  },
  baseText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  primaryText: {
    color: '#18181B',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#18181B',
  },
  dangerText: {
    color: '#FFFFFF',
  },
  disabledText: {
    color: Colors.textMuted,
  },
});
