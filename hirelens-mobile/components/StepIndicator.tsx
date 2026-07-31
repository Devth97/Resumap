import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

interface StepIndicatorProps {
  currentStep: number; // 1 to 4
  totalSteps?: number;
  labels?: string[];
}

const DEFAULT_LABELS = ['Upload', 'Target Role', 'Context', 'Results'];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps = 4,
  labels = DEFAULT_LABELS,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.stepsRow}>
        {labels.map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <React.Fragment key={label}>
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.circle,
                    isCompleted && styles.completedCircle,
                    isActive && styles.activeCircle,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNumberText,
                      (isActive || isCompleted) && styles.activeStepNumberText,
                    ]}
                  >
                    {isCompleted ? '✓' : stepNum}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.label,
                    isActive && styles.activeLabel,
                    isCompleted && styles.completedLabel,
                  ]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </View>
              {stepNum < totalSteps && (
                <View
                  style={[
                    styles.line,
                    isCompleted && styles.completedLine,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    gap: 4,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCircle: {
    backgroundColor: Colors.accentPrimary,
    borderColor: Colors.accentSecondary,
  },
  completedCircle: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  stepNumberText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  activeStepNumberText: {
    color: '#FFFFFF',
  },
  label: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  activeLabel: {
    color: Colors.accentSecondary,
    fontWeight: '700',
  },
  completedLabel: {
    color: Colors.textSecondary,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 4,
    marginBottom: 16,
  },
  completedLine: {
    backgroundColor: Colors.success,
  },
});
