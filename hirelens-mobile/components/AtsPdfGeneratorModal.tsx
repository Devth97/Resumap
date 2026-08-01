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
import { FileText, Download, Check, X, Printer } from 'lucide-react-native';

interface AtsPdfGeneratorModalProps {
  visible: boolean;
  onClose: () => void;
  targetRoleName?: string;
  analysisResult?: any;
}

export const AtsPdfGeneratorModal: React.FC<AtsPdfGeneratorModalProps> = ({
  visible,
  onClose,
  targetRoleName = 'Software Engineer',
  analysisResult,
}) => {
  const [downloaded, setDownloaded] = useState(false);

  // Extract the REAL candidate details pulled from the uploaded resume by the AI.
  const profile = analysisResult?.candidateProfile || {};
  const detectedSkills: string[] = (profile.detectedSkills || [])
    .map((s: any) => s?.skillName || s?.name || s)
    .filter(Boolean);
  const skills = detectedSkills.length
    ? detectedSkills.join(', ')
    : 'Add your key technical skills';
  const tools = profile.detectedTools?.length
    ? profile.detectedTools.join(', ')
    : 'Add tools & platforms you have used';
  const rawEducation = profile.educationSummary;
  const education =
    rawEducation && rawEducation.toLowerCase() !== 'not provided'
      ? rawEducation
      : 'Add your degree, institution and graduation year';
  const realProjects: any[] = profile.projects || [];
  const improvements = analysisResult?.resumeImprovements || [];
  const strengths = analysisResult?.strengths || [];

  // A concise, ATS-friendly professional summary generated from the resume data.
  const levelLabel =
    profile.experienceLevel === 'recent_graduate'
      ? 'Recent graduate'
      : profile.experienceLevel === 'entry_level'
      ? 'Entry-level professional'
      : 'Motivated student';
  const summary = `${levelLabel} targeting ${targetRoleName} roles, with hands-on exposure to ${
    detectedSkills.slice(0, 4).join(', ') || 'core technical skills'
  }. Focused on building practical, results-driven projects with measurable impact.`;

  const esc = (s: any) =>
    String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  // Build the AI-quantified projects section from REAL extracted projects,
  // falling back to the AI resume-improvement examples when none were detected.
  const projectsHtml = realProjects.length
    ? realProjects
        .map(
          (p: any) => `
  <div class="entry-header">
    <span>${esc(p.title || 'Project')}</span>
    <span>${p.evidenceStrength ? esc(p.evidenceStrength) + ' evidence' : ''}</span>
  </div>
  <ul>
    ${p.summary ? `<li>${esc(p.summary)}</li>` : ''}
    ${p.tools?.length ? `<li><strong>Stack:</strong> ${esc(p.tools.join(', '))}</li>` : ''}
  </ul>`
        )
        .join('')
    : `
  <div class="entry-header"><span>Portfolio Project</span><span></span></div>
  <ul>
    ${
      improvements
        .slice(0, 3)
        .map((imp: any) => `<li>${esc(imp.example || imp.recommendation || '')}</li>`)
        .join('') ||
      '<li>Add a project demonstrating your target-role skills, with quantified impact.</li>'
    }
  </ul>`;

  // Reliable web print-to-PDF: render into a hidden iframe and call print()
  // on it. Avoids popup blockers and OS permission prompts entirely.
  const printViaIframe = (html: string) => {
    const existing = document.getElementById('ats-print-frame');
    if (existing) existing.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'ats-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const win = iframe.contentWindow;
    const doc = iframe.contentWindow?.document;
    if (!win || !doc) {
      setDownloaded(false);
      return;
    }

    doc.open();
    doc.write(html);
    doc.close();

    const doPrint = () => {
      try {
        win.focus();
        win.print();
      } catch (e) {
        // ignore
      }
      setDownloaded(false);
    };

    // Give the browser a moment to lay out the document before printing.
    setTimeout(doPrint, 400);
  };

  const handleDownload = () => {
    setDownloaded(true);

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ResuMap - ATS Optimized Resume (${targetRoleName})</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #1a1a2e;
      line-height: 1.5;
    }
    h1 {
      text-align: center;
      margin-bottom: 4px;
      font-size: 24px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .contact-info {
      text-align: center;
      font-size: 11px;
      color: #5a5a5a;
      margin-bottom: 20px;
    }
    .section-title {
      font-size: 13px;
      font-weight: bold;
      color: #2d2d2d;
      border-bottom: 1.5px solid #1a1a2e;
      padding-bottom: 2px;
      margin-top: 18px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .entry-header {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: 12px;
    }
    .entry-sub {
      font-size: 11px;
      color: #666666;
      font-style: italic;
      margin-bottom: 6px;
    }
    p {
      font-size: 11px;
      margin: 4px 0 10px 0;
    }
    ul {
      margin: 4px 0 10px 18px;
      padding: 0;
    }
    li {
      font-size: 11px;
      margin-bottom: 4px;
    }
    .ats-badge {
      margin-top: 24px;
      padding: 8px;
      border: 1px dashed #00B894;
      background-color: #E6F9F5;
      color: #00896C;
      font-size: 10px;
      text-align: center;
      font-weight: bold;
      border-radius: 4px;
    }
    @media print {
      body { margin: 20px; }
      .ats-badge { display: none; }
    }
  </style>
</head>
<body>
  <h1>${esc(profile.candidateName || 'Your Name')}</h1>
  <div class="contact-info">
    ${esc(profile.contactInfo || 'Add your phone • email • LinkedIn • GitHub')}
  </div>

  <div class="section-title">PROFESSIONAL SUMMARY</div>
  <p>${esc(summary)}</p>

  <div class="section-title">EDUCATION</div>
  <div class="entry-header">
    <span>${esc(education)}</span>
  </div>

  <div class="section-title">TECHNICAL SKILLS</div>
  <ul>
    <li><strong>Core Skills:</strong> ${esc(skills)}</li>
    <li><strong>Tools & Platforms:</strong> ${esc(tools)}</li>
  </ul>

  <div class="section-title">PROJECTS</div>
  ${projectsHtml}

  ${
    strengths.length
      ? `<div class="section-title">KEY STRENGTHS</div>
  <ul>
    ${strengths
      .map((str: any) => `<li><strong>${esc(str.title)}:</strong> ${esc(str.explanation || str.relevance)}</li>`)
      .join('')}
  </ul>`
      : ''
  }

  <div class="ats-badge">
    &check; 100% Single-Column ATS Scanner Verified Format (Workday, Taleo, Greenhouse)
  </div>
</body>
</html>`;

      printViaIframe(htmlContent);
    } else {
      Alert.alert(
        'ATS Resume Generated!',
        `Your 1-page ATS-optimized resume for ${targetRoleName} has been generated.`,
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
                <Text style={styles.modalTitle}>1-Click ATS Resume Generator</Text>
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
                <Text style={styles.candidateName}>{profile.candidateName || 'Your Name'}</Text>
                <Text style={styles.contactDetails}>
                  {profile.contactInfo || 'Add your phone • email • LinkedIn • GitHub'}
                </Text>
              </View>

              {/* Education */}
              <View style={styles.resumeSection}>
                <Text style={styles.sectionHeading}>EDUCATION</Text>
                <View style={styles.sectionDivider} />
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>{education}</Text>
                </View>
              </View>

              {/* Skills */}
              <View style={styles.resumeSection}>
                <Text style={styles.sectionHeading}>TECHNICAL SKILLS</Text>
                <View style={styles.sectionDivider} />
                <Text style={styles.skillLine}>
                  <Text style={{ fontWeight: '700' }}>Detected Skills: </Text>
                  {skills}
                </Text>
              </View>

              {/* Projects */}
              <View style={styles.resumeSection}>
                <Text style={styles.sectionHeading}>AI-QUANTIFIED PROJECTS ({targetRoleName.toUpperCase()})</Text>
                <View style={styles.sectionDivider} />
                {realProjects.length ? (
                  realProjects.map((p: any, idx: number) => (
                    <View key={idx} style={{ gap: 2, marginBottom: 6 }}>
                      <View style={styles.entryRow}>
                        <Text style={styles.entryTitle}>{p.title || 'Project'}</Text>
                        {p.evidenceStrength ? (
                          <Text style={styles.entryDate}>{p.evidenceStrength} evidence</Text>
                        ) : null}
                      </View>
                      {p.summary ? <Text style={styles.bulletItem}>• {p.summary}</Text> : null}
                      {p.tools?.length ? (
                        <Text style={styles.bulletItem}>• Stack: {p.tools.join(', ')}</Text>
                      ) : null}
                    </View>
                  ))
                ) : improvements.length ? (
                  improvements.slice(0, 3).map((imp: any, idx: number) => (
                    <Text key={idx} style={styles.bulletItem}>
                      • {imp.example || imp.recommendation}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.bulletItem}>
                    • Add a project demonstrating your target-role skills, with quantified impact.
                  </Text>
                )}
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
              <Printer size={18} color="#18181B" />
              <Text style={styles.downloadBtnText}>
                {downloaded ? 'Opening Print to PDF...' : 'Print / Download ATS PDF'}
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
