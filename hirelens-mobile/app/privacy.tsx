import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../constants/theme';

const LAST_UPDATED = '4 August 2026';
const CONTACT_EMAIL = 'ornalens@gmail.com';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export default function PrivacyScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.updated}>Last updated: {LAST_UPDATED}</Text>

      <Text style={styles.paragraph}>
        ResuMap ("we", "our", "the app") helps job seekers check how well their resume matches
        a target role and generates an improvement roadmap. This policy explains what data the
        app collects, how it is used, and who it is shared with.
      </Text>

      <Section title="No account required">
        <Text style={styles.paragraph}>
          ResuMap does not require you to sign up or log in. When you open the app, we create a
          temporary, anonymous session tied to a hashed device identifier. Sessions expire
          automatically after 7 days.
        </Text>
      </Section>

      <Section title="Information we collect">
        <Text style={styles.paragraph}>
          {'•'} The resume file you upload (PDF, JPG, or PNG), including the text, name,
          contact details, and education history it contains.{'\n'}
          {'•'} The target role and any answers you provide in the context questionnaire.
          {'\n'}
          {'•'} Optional feedback you submit about your results.{'\n'}
          {'•'} A hashed device identifier and, if applicable, an event/workshop code used
          to group sessions.{'\n'}
          {'•'} Basic advertising identifiers collected by Google AdMob when ads are shown
          (see "Advertising" below).
        </Text>
      </Section>

      <Section title="How we use your information">
        <Text style={styles.paragraph}>
          Your resume content is sent to our third-party AI provider (NVIDIA NIM) solely to
          analyse it against your selected role and generate a readiness score, strengths, gaps,
          and a roadmap. We use this data only to produce and display your results and the
          downloadable ATS-style PDF report you request — we do not sell your resume data or
          use it to train third-party models.
        </Text>
      </Section>

      <Section title="Where your data is stored">
        <Text style={styles.paragraph}>
          Session and analysis data is stored using Supabase, our database provider. Data is
          retained only for the lifetime of your session (7 days) unless you request earlier
          deletion.
        </Text>
      </Section>

      <Section title="Advertising">
        <Text style={styles.paragraph}>
          ResuMap shows ads and rewarded ads (to unlock extra features) using Google AdMob.
          AdMob may collect advertising identifiers and device information to serve and measure
          ads, governed by Google's own privacy policy:{' '}
          https://policies.google.com/privacy
        </Text>
      </Section>

      <Section title="Data deletion">
        <Text style={styles.paragraph}>
          Since ResuMap does not use accounts, most data expires automatically after 7 days. To
          request earlier deletion of your data, contact us at {CONTACT_EMAIL} with your session
          details.
        </Text>
      </Section>

      <Section title="Children's privacy">
        <Text style={styles.paragraph}>
          ResuMap is intended for job seekers and is not directed at children. We do not
          knowingly collect data from children under 13.
        </Text>
      </Section>

      <Section title="Changes to this policy">
        <Text style={styles.paragraph}>
          We may update this policy as the app changes. Material changes will update the "Last
          updated" date above.
        </Text>
      </Section>

      <Section title="Contact us">
        <Text style={styles.paragraph}>
          Questions about this policy or your data? Email us at {CONTACT_EMAIL}.
        </Text>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.background,
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  updated: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.textSecondary,
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
});
