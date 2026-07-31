import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { AppCard } from './AppCard';
import { Colors } from '../constants/theme';
import { FileUp, FileCheck, AlertCircle } from 'lucide-react-native';

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
    <AppCard glowing={!!selectedFile}>
      <TouchableOpacity
        activeOpacity={0.7}
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
  dropZone: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(99, 102, 241, 0.4)',
    borderRadius: 14,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  placeholderContainer: {
    alignItems: 'center',
    gap: 8,
  },
  selectedContainer: {
    alignItems: 'center',
    gap: 6,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  iconCircleSuccess: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  uploadSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  fileNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  fileMetaText: {
    fontSize: 13,
    color: Colors.accentSecondary,
    fontWeight: '600',
  },
  changeText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  typeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
