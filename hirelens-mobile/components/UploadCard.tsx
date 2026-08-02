import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { AppCard } from './AppCard';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../constants/theme';
import { FileUp, FileCheck } from 'lucide-react-native';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export interface SelectedFileAsset {
  uri: string;
  name: string;
  size: number;
  mimeType: string;
}

interface UploadCardProps {
  selectedFile: SelectedFileAsset | null;
  onFileSelect: (file: SelectedFileAsset | null) => void;
  onError: (msg: string) => void;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  selectedFile,
  onFileSelect,
  onError,
}) => {
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      const size = asset.size ?? 0;

      if (size <= 0) {
        onError('The selected file is empty.');
        return;
      }

      if (size > MAX_FILE_SIZE) {
        onError('Please upload a file smaller than 5 MB.');
        return;
      }

      const mimeType = asset.mimeType || (asset.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');

      onFileSelect({
        uri: asset.uri,
        name: asset.name,
        size,
        mimeType,
        file: (asset as any).file,
      } as any);
    } catch (err: any) {
      onError('Failed to select file. Please try again.');
    }
  };

  return (
    <AppCard variant="upload" padding="xl" style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePickDocument}
        style={styles.dropZone}
      >
        {selectedFile ? (
          <View style={styles.selectedContainer}>
            <View style={styles.iconCircleSuccess}>
              <FileCheck size={32} color={Colors.success} />
            </View>
            <Text style={styles.fileNameText} numberOfLines={1}>
              {selectedFile.name}
            </Text>
            <Text style={styles.fileMetaText}>
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.mimeType.split('/')[1].toUpperCase()}
            </Text>
            <Text style={styles.changeText}>Tap to change resume file</Text>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <View style={styles.iconCircle}>
              <FileUp size={36} color={Colors.accentPrimary} />
            </View>
            <Text style={styles.uploadTitle}>Upload Your Resume</Text>
            <Text style={styles.uploadSubtitle}>
              Tap to browse PDF, JPG, or PNG (Max 5 MB)
            </Text>
            <View style={styles.badgeRow}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>PDF</Text>
              </View>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>JPG</Text>
              </View>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>PNG</Text>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: Spacing.md,
  },
  dropZone: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.borderFocus,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.uploadBg,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  placeholderContainer: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  selectedContainer: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.stageBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  iconCircleSuccess: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  uploadTitle: {
    fontSize: Typography.heading3.fontSize,
    fontWeight: Typography.heading3.fontWeight,
    color: Colors.textPrimary,
  },
  uploadSubtitle: {
    fontSize: Typography.bodySmall.fontSize,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  fileNameText: {
    fontSize: Typography.heading4.fontSize,
    fontWeight: Typography.heading4.fontWeight,
    color: Colors.textPrimary,
  },
  fileMetaText: {
    fontSize: Typography.caption.fontSize,
    color: Colors.accentSecondary,
    fontWeight: '600',
  },
  changeText: {
    fontSize: Typography.caption.fontSize,
    color: Colors.accentPrimary,
    marginTop: Spacing.xs,
    textDecorationLine: 'underline',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  typeBadge: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  typeBadgeText: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});