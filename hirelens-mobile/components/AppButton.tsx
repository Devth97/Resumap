import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

  if (isPrimary && !disabled) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.glowWrapper, style]}
      >
        <LinearGradient
          colors={Colors.accentGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              {icon}
              <Text style={[styles.primaryText, textStyle]}>{title}</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        isOutline ? styles.outlineButton : styles.secondaryButton,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Colors.textPrimary} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.secondaryText,
              isOutline && styles.outlineText,
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
  glowWrapper: {
    borderRadius: 14,
    ...Shadows.glow,
  },
  gradientButton: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  button: {
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.accentPrimary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  outlineText: {
    color: Colors.accentPrimary,
  },
  disabledText: {
    color: Colors.textMuted,
  },
});
