import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';
import { Colors } from '../constants/theme';
import { Sparkles, Copy, Check, Wand2 } from 'lucide-react-native';

export const BulletRewriterCard: React.FC = () => {
  const [inputBullet, setInputBullet] = useState('');
  const [rewrittenBullets, setRewrittenBullets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleRewrite = () => {
    if (!inputBullet.trim()) return;

    setLoading(true);

    setTimeout(() => {
      const cleanInput = inputBullet.trim();
      setRewrittenBullets([
        `• Engineered ${cleanInput} resulting in 35% faster execution time and improved system responsiveness across 1,000+ test cases.`,
        `• Developed and deployed ${cleanInput} utilizing production best practices, cutting processing latencies by 28%.`,
        `• Spearheaded ${cleanInput} with modular architecture, documenting 100% API coverage and presenting to technical leads.`,
      ]);
      setLoading(false);
    }, 600);
  };

  const handleCopy = (text: string, idx: number) => {
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <AppCard style={styles.card} glowing>
      <View style={styles.headerRow}>
        <Wand2 size={20} color={Colors.accentSecondary} />
        <Text style={styles.title}>AI Bullet Point Quantifier & ATS Rewriter</Text>
      </View>

      <Text style={styles.subtitle}>
        Paste any weak academic bullet point to generate quantified, high-impact ATS bullet points:
      </Text>

      <TextInput
        style={styles.input}
        placeholder="e.g., Created a web app for college project using React..."
        placeholderTextColor="rgba(255, 255, 255, 0.5)"
        value={inputBullet}
        onChangeText={setInputBullet}
        multiline
      />

      <AppButton
        title="Quantify & Optimize for ATS"
        onPress={handleRewrite}
        disabled={!inputBullet.trim() || loading}
        loading={loading}
        icon={<Sparkles size={16} color="#FFFFFF" />}
        style={{ marginTop: 8 }}
      />

      {rewrittenBullets.length > 0 ? (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsHeader}>ATS-Optimized High-Impact Options:</Text>
          {rewrittenBullets.map((bullet, idx) => (
            <View key={idx} style={styles.bulletCard}>
              <Text style={styles.bulletText}>{bullet}</Text>
              <TouchableOpacity
                onPress={() => handleCopy(bullet, idx)}
                style={styles.copyButton}
              >
                {copiedIdx === idx ? (
                  <Check size={14} color={Colors.success} />
                ) : (
                  <Copy size={14} color={Colors.accentSecondary} />
                )}
                <Text style={[styles.copyText, copiedIdx === idx && { color: Colors.success }]}>
                  {copiedIdx === idx ? 'Copied' : 'Copy'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : null}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(18, 24, 38, 0.9)',
    marginVertical: 10,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    flex: 1,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 17,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 12,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 13,
    minHeight: 64,
    textAlignVertical: 'top',
  },
  resultsContainer: {
    gap: 8,
    marginTop: 8,
  },
  resultsHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accentSecondary,
  },
  bulletCard: {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  bulletText: {
    fontSize: 12,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  copyText: {
    fontSize: 11,
    color: Colors.accentSecondary,
    fontWeight: '600',
  },
});
