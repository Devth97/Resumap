import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Pressable,
  ImageStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { Sparkles, X, Map, Award, Upload } from 'lucide-react-native';

export const FloatingMascot: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* Neo-Brutalist Floating Mascot Trigger */}
      <View style={styles.floatingContainer} pointerEvents="box-none">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setModalVisible(true)}
          style={styles.mascotButton}
        >
          <Image
            source={require('../assets/mascot.jpg')}
            style={styles.avatarImage as ImageStyle}
            resizeMode="cover"
          />
          <View style={styles.onlineDot} />
        </TouchableOpacity>
      </View>

      {/* Interactive AI Assistant Popover Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.mascotHeaderTitleRow}>
                <Image
                  source={require('../assets/mascot.jpg')}
                  style={styles.modalAvatar as ImageStyle}
                  resizeMode="cover"
                />
                <View>
                  <View style={styles.nameRow}>
                    <Text style={styles.mascotName}>Lensy AI</Text>
                    <View style={styles.aiBadge}>
                      <Sparkles size={10} color="#18181B" />
                      <Text style={styles.aiBadgeText}>AI MENTOR</Text>
                    </View>
                  </View>
                  <Text style={styles.mascotSubtitle}>Student Career Assistant</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={18} color="#18181B" />
              </TouchableOpacity>
            </View>

            {/* Speech Bubble */}
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>
                "Hey there! I'm Lensy. Need resume tips, your personalized roadmap guide, or instant ATS bullet point optimization? Tap any option below!"
              </Text>
            </View>

            {/* Quick Actions List */}
            <ScrollView style={styles.actionsList} showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.actionItem, { backgroundColor: Colors.accentSecondary }]}
                onPress={() => {
                  setModalVisible(false);
                  router.push(ROUTES.UPLOAD as any);
                }}
              >
                <View style={styles.actionIconCircle}>
                  <Upload size={18} color="#18181B" />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionTitle}>Upload & Analyze Resume</Text>
                  <Text style={styles.actionSub}>Instant AI score & 4-stage action plan</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionItem, { backgroundColor: Colors.accentCyan }]}
                onPress={() => {
                  setModalVisible(false);
                  router.push(ROUTES.UPLOAD as any);
                }}
              >
                <View style={styles.actionIconCircle}>
                  <Map size={18} color="#18181B" />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionTitle}>Your Roadmap Guide</Text>
                  <Text style={styles.actionSub}>Get a personalized 4-stage career action plan</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionItem, { backgroundColor: Colors.accentPink }]}
                onPress={() => {
                  setModalVisible(false);
                  router.push(ROUTES.ROLE as any);
                }}
              >
                <View style={styles.actionIconCircle}>
                  <Award size={18} color="#18181B" />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={[styles.actionTitle, { color: '#FFFFFF' }]}>Explore Target Roles</Text>
                  <Text style={[styles.actionSub, { color: '#FFFDF5' }]}>View requirements for SDE, Data Analyst & AI</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 9999,
  },
  mascotButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: Colors.borderPrimary,
    backgroundColor: Colors.accentSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glow,
  },
  avatarImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  onlineDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: Colors.success,
    borderWidth: 2.5,
    borderColor: Colors.surface,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(24, 24, 27, 0.65)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: Spacing.md,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.borderPrimary,
    padding: Spacing.xl,
    gap: Spacing.lg,
    ...Shadows.card,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mascotHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  modalAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: Colors.borderPrimary,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  mascotName: {
    fontSize: Typography.heading3.fontSize,
    fontWeight: Typography.heading3.fontWeight,
    color: Colors.textPrimary,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.accentSecondary,
    borderWidth: 1.5,
    borderColor: Colors.borderPrimary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  aiBadgeText: {
    fontSize: Typography.caption.fontSize,
    fontWeight: Typography.caption.fontWeight,
    color: Colors.textPrimary,
  },
  mascotSubtitle: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 2,
    borderColor: Colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechBubble: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 2,
    borderColor: Colors.borderPrimary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.button,
  },
  speechText: {
    fontSize: Typography.bodySmall.fontSize,
    color: Colors.textPrimary,
    lineHeight: Typography.bodySmall.lineHeight,
    fontWeight: '600',
  },
  actionsList: {
    maxHeight: 230,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.borderPrimary,
    marginBottom: Spacing.md,
    ...Shadows.button,
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: Typography.subheading.fontSize,
    fontWeight: Typography.subheading.fontWeight,
    color: Colors.textPrimary,
  },
  actionSub: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
});