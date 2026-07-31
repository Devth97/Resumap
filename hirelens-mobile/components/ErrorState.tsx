import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';
import { Colors } from '../constants/theme';
import { AlertCircle } from 'lucide-react-native';

interface ErrorStateProps {
  title?: string;
  message: string;
  userAction?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Analysis Failed',
  message,
  userAction,
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <AppCard style={styles.card}>
        <View style={styles.iconCircle}>
          <AlertCircle size={36} color={Colors.danger} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        {userAction ? <Text style={styles.userAction}>{userAction}</Text> : null}
        {onRetry ? (
          <AppButton title="Try Again" onPress={onRetry} style={{ marginTop: 14 }} />
        ) : null}
      </AppCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    paddingVertical: 24,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  userAction: {
    fontSize: 13,
    color: Colors.accentSecondary,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
});
