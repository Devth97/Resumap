import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, ViewStyle, TextStyle } from 'react-native';
import { Colors, Shadows, Spacing, Typography, BorderRadius } from '../constants/theme';

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
  const isSecondary = variant === 'secondary';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        isPrimary && styles.primaryButton,
        isSecondary && styles.secondaryButton,
        isOutline && styles.outlineButton,
        isDanger && styles.dangerButton,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary || isOutline ? Colors.textPrimary : '#FFFFFF'} size="small" />
      ) : (
        <>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <Text
            style={[
              styles.baseText,
              isPrimary && styles.primaryText,
              isSecondary && styles.secondaryText,
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
    height: 56,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    borderWidth: 1,
    ...Shadows.button,
  },
  primaryButton: {
    backgroundColor: Colors.accentSecondary, // Canary Yellow
    borderColor: Colors.borderSubtle,
  },
  secondaryButton: {
    backgroundColor: Colors.accentPrimary, // Electric Violet
    borderColor: Colors.accentPrimary,
  },
  outlineButton: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderPrimary,
  },
  dangerButton: {
    backgroundColor: Colors.danger,
    borderColor: Colors.danger,
  },
  disabledButton: {
    opacity: 0.5,
  },
  iconWrapper: {
    marginRight: Spacing.xs,
  },
  baseText: {
    fontSize: Typography.button.fontSize,
    fontWeight: Typography.button.fontWeight,
    letterSpacing: Typography.button.letterSpacing,
  },
  primaryText: {
    color: Colors.textPrimary,
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: Colors.textPrimary,
  },
  dangerText: {
    color: '#FFFFFF',
  },
  disabledText: {
    color: Colors.textMuted,
  },
});