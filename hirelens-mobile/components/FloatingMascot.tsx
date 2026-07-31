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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Shadows } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { Sparkles, X, Shield, Award, Upload, HelpCircle } from 'lucide-react-native';

export const FloatingMascot: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* Floating Bottom-Right Trigger Button */}
      <View style={styles.floatingContainer} pointerEvents="box-none">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setModalVisible(true)}
          style={styles.mascotButton}
        >
          <Image
            source={require('../assets/mascot.jpg')}
            style={styles.avatarImage}
            resizeMode="cover"
          />
          <View style={styles.onlineDot} />
        </TouchableOpacity>
      </View>

      {/* Interactive AI Assistant Modal */}
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
                  style={styles.modalAvatar}
                  resizeMode="cover"
                />
                <View>
                  <View style={styles.nameRow}>
                    <Text style={styles.mascotName}>Lensy AI</Text>
                    <View style={styles.aiBadge}>
                      <Sparkles size={10} color="#06B6D4" />
                      <Text style={styles.aiBadgeText}>AI GUIDE</Text>
                    </View>
                  </View>
                  <Text style={styles.mascotSubtitle}>Student Career Assistant</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Speech Bubble */}
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>
                "Hey there! I'm Lensy. Whether you need resume formatting tips, want to check PII privacy, or jump straight into analysis — I'm here to guide you!"
              </Text>
            </View>

            {/* Quick Actions List */}
            <ScrollView style={styles.actionsList} showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => {
                  setModalVisible(false);
                  router.push(ROUTES.UPLOAD as any);
                }}
              >
                <View style={[styles.actionIconCircle, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]}>
                  <Upload size={18} color={Colors.accentPrimary} />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionTitle}>Upload & Analyze Resume</Text>
                  <Text style={styles.actionSub}>Instant AI score & 4-stage action plan</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => {
                  setModalVisible(false);
                  router.push(ROUTES.PRIVACY as any);
                }}
              >
                <View style={[styles.actionIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                  <Shield size={18} color={Colors.success} />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionTitle}>PII Privacy Shield</Text>
                  <Text style={styles.actionSub}>Learn how your personal info stays 100% safe</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => {
                  setModalVisible(false);
                  router.push(ROUTES.ROLE as any);
                }}
              >
                <View style={[styles.actionIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                  <Award size={18} color={Colors.warning} />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionTitle}>Explore Target Roles</Text>
                  <Text style={styles.actionSub}>View requirements for SDE, Data Analyst & AI</Text>
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
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2.5,
    borderColor: '#6366F1',
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glow,
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#090D16',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 10, 17, 0.82)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#111827',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.35)',
    padding: 20,
    gap: 16,
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
    gap: 12,
  },
  modalAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#06B6D4',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mascotName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  aiBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#06B6D4',
  },
  mascotSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechBubble: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 16,
    padding: 14,
  },
  speechText: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  actionsList: {
    maxHeight: 220,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 8,
  },
  actionIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  actionSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
});
