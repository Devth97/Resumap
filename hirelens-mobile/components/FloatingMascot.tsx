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
            style={styles.avatarImage}
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
                  style={styles.modalAvatar}
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
                style={[styles.actionItem, { backgroundColor: '#FFD93D' }]}
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
                style={[styles.actionItem, { backgroundColor: '#00CEC9' }]}
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
                style={[styles.actionItem, { backgroundColor: '#FF7675' }]}
                onPress={() => {
                  setModalVisible(false);
                  router.push(ROUTES.ROLE as any);
                }}
              >
                <View style={styles.actionIconCircle}>
                  <Award size={18} color="#FFFFFF" />
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
    borderWidth: 3,
    borderColor: '#18181B',
    backgroundColor: '#FFD93D',
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
    backgroundColor: '#00B894',
    borderWidth: 2.5,
    borderColor: '#18181B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(24, 24, 27, 0.65)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#18181B',
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
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    borderColor: '#18181B',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mascotName: {
    fontSize: 19,
    fontWeight: '900',
    color: '#18181B',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFD93D',
    borderWidth: 1.5,
    borderColor: '#18181B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  aiBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#18181B',
  },
  mascotSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FAF7F0',
    borderWidth: 2,
    borderColor: '#18181B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechBubble: {
    backgroundColor: '#FFFDF5',
    borderWidth: 2,
    borderColor: '#18181B',
    borderRadius: 16,
    padding: 14,
    ...Shadows.button,
  },
  speechText: {
    fontSize: 13,
    color: '#18181B',
    lineHeight: 19,
    fontWeight: '600',
  },
  actionsList: {
    maxHeight: 230,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: '#18181B',
    marginBottom: 10,
    ...Shadows.button,
  },
  actionIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#18181B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#18181B',
  },
  actionSub: {
    fontSize: 11,
    color: '#475569',
    marginTop: 1,
    fontWeight: '600',
  },
});
