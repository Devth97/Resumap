import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/theme';

interface LoadingStateProps {
  message?: string;
  stage?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Analyzing Resume & Role Alignment...',
  stage,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.accentPrimary} />
      <Text style={styles.messageText}>{message}</Text>
      {stage ? <Text style={styles.stageText}>{stage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  messageText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  stageText: {
    fontSize: 13,
    color: Colors.accentSecondary,
    fontWeight: '600',
  },
});
