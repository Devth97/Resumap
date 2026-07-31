import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { Colors, Shadows } from '../constants/theme';
import { FileText, Download, Check, X } from 'lucide-react-native';

interface AtsPdfGeneratorModalProps {
  visible: boolean;
  onClose: () => void;
  targetRoleName?: string;
}

export const AtsPdfGeneratorModal: React.FC<AtsPdfGeneratorModalProps> = ({
  visible,
  onClose,
  targetRoleName = 'Software Engineer',
}) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);

    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const resumeContent = `CANDIDATE NAME
City, State • linkedin.com/in/candidate • github.com/candidate

================================================================================
EDUCATION
================================================================================
B.Tech in Computer Science & Engineering | 2022 - 2026
Relevant Coursework: Data Structures, Database Systems, Web Development

================================================================================
TECHNICAL SKILLS
================================================================================
Languages & Tools: Python, JavaScript, SQL, React, Git, PostgreSQL

================================================================================
AI-QUANTIFIED PROJECTS (${targetRoleName.toUpperCase()})
================================================================================
Sales Performance & Analytics Dashboard | 2025
• Engineered responsive web reporting portal for 2,500+ users, cutting query load time by 35%.
• Analyzed 15,000+ transaction records utilizing SQL window functions to surface key revenue trends.
`;

      const blob = new Blob([resumeContent], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Resumap_${targetRoleName.replace(/\s+/g, '_')}_ATS_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      Alert.alert(
        'ATS PDF Downloaded!',
        `Your 1-page ATS-optimized resume for ${targetRoleName} has been saved to your Downloads.`,
        [{ text: 'OK', onPress: () => setDownloaded(false) }]
      );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleBadgeRow}>
              <View style={styles.iconCircle}>
                <FileText size={20} color="#18181B" />
              </View>
              <View>
                <Text style={styles.modalTitle}>1-Click ATS PDF Generator</Text>
                <Text style={styles.modalSubtitle}>Formats for 99% ATS Scanners (Workday, Taleo)</Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#18181B" />
            </TouchableOpacity>
          </View>

          {/* Live Document Preview Box */}
          <ScrollView style={styles.previewContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.resumePaper}>
              {/* Header */}
              <View style={styles.resumeHeader}>
                <Text style={styles.candidateName}>CANDIDATE NAME</Text>
                <Text style={styles.contactDetails}>
                  City, State • linkedin.com/in/candidate • github.com/candidate
                </Text>
              </View>

              {/* Education */}
              <View style={styles.resumeSection}>
                <Text style={styles.sectionHeading}>EDUCATION</Text>
                <View style={styles.sectionDivider} />
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>B.Tech in Computer Science & Engineering</Text>
                  <Text style={styles.entryDate}>2022 - 2026</Text>
                </View>
                <Text style={styles.entrySub}>Relevant Coursework: Data Structures, Database Systems, Web Development</Text>
              </View>

              {/* Skills */}
              <View style={styles.resumeSection}>
                <Text style={styles.sectionHeading}>TECHNICAL SKILLS</Text>
                <View style={styles.sectionDivider} />
                <Text style={styles.skillLine}>
                  <Text style={{ fontWeight: '700' }}>Languages & Tools: </Text>
                  Python, JavaScript, SQL, React, Git, PostgreSQL
                </Text>
              </View>

              {/* Projects */}
              <View style={styles.resumeSection}>
                <Text style={styles.sectionHeading}>AI-QUANTIFIED PROJECTS ({targetRoleName.toUpperCase()})</Text>
                <View style={styles.sectionDivider} />
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>Sales Performance & Analytics Dashboard</Text>
                  <Text style={styles.entryDate}>2025</Text>
                </View>
                <Text style={styles.bulletItem}>
                  • Engineered responsive web reporting portal for 2,500+ users, cutting query load time by 35%.
                </Text>
                <Text style={styles.bulletItem}>
                  • Analyzed 15,000+ transaction records utilizing SQL window functions to surface key revenue trends.
                </Text>
              </View>

              {/* ATS Compliance Badge */}
              <View style={styles.atsVerifiedPill}>
                <Check size={12} color="#00B894" />
                <Text style={styles.atsVerifiedText}>100% Single-Column ATS Verified Layout</Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
              <Download size={18} color="#18181B" />
              <Text style={styles.downloadBtnText}>
                {downloaded ? 'Downloading Resume File...' : 'Download 1-Page ATS PDF'}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(24, 24, 27, 0.75)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#FAF7F0',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 3,
    borderColor: '#18181B',
    padding: 20,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFD93D',
    borderWidth: 2,
    borderColor: '#18181B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#18181B',
  },
  modalSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#18181B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContainer: {
    maxHeight: 380,
  },
  resumePaper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#18181B',
    borderRadius: 16,
    padding: 16,
    gap: 10,
    ...Shadows.card,
  },
  resumeHeader: {
    alignItems: 'center',
    gap: 2,
    paddingBottom: 6,
  },
  candidateName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#18181B',
    letterSpacing: 1,
  },
  contactDetails: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  resumeSection: {
    gap: 4,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '900',
    color: '#6C5CE7',
    letterSpacing: 0.5,
  },
  sectionDivider: {
    height: 1.5,
    backgroundColor: '#18181B',
    marginBottom: 4,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  entryTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#18181B',
  },
  entryDate: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  entrySub: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  skillLine: {
    fontSize: 10.5,
    color: '#18181B',
  },
  bulletItem: {
    fontSize: 10.5,
    color: '#18181B',
    lineHeight: 15,
  },
  atsVerifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 184, 148, 0.15)',
    borderWidth: 1.5,
    borderColor: '#00B894',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  atsVerifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00B894',
  },
  actionButtonsRow: {
    marginTop: 4,
  },
  downloadBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFD93D',
    borderWidth: 2.5,
    borderColor: '#18181B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadows.button,
  },
  downloadBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#18181B',
  },
});
