
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

export default function SetupInfoScreen() {
  const router = useRouter();

  const openGoogleSheet = () => {
    Linking.openURL('https://docs.google.com/spreadsheets/d/1pwiLjwOjnqRtEQsonVWtVt8hAMSF0qLZmY0zTlJyKc0/edit');
  };

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? 48 : 0 }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow_back"
            size={28}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setup Guide</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.section}>
          <View style={styles.iconContainer}>
            <IconSymbol
              ios_icon_name="info.circle.fill"
              android_material_icon_name="info"
              size={48}
              color={colors.primary}
            />
          </View>
          <Text style={styles.title}>Video Setup Instructions</Text>
          <Text style={styles.subtitle}>
            Follow these steps to ensure videos load correctly
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Google Sheet Structure</Text>
          </View>
          <Text style={styles.stepText}>
            Your Google Sheet should have:{'\n'}
            • Column A: Word/Phrase (e.g., &quot;hello&quot;){'\n'}
            • Column B: Video URL{'\n'}
            • Row 1: Headers (will be skipped)
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepTitle}>Make Sheet Public</Text>
          </View>
          <Text style={styles.stepText}>
            1. Open your Google Sheet{'\n'}
            2. Click &quot;Share&quot; button{'\n'}
            3. Change to &quot;Anyone with the link can view&quot;{'\n'}
            4. Click &quot;Done&quot;
          </Text>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={openGoogleSheet}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="link"
              android_material_icon_name="link"
              size={16}
              color={colors.primary}
            />
            <Text style={styles.linkButtonText}>Open Google Sheet</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepTitle}>Video Hosting Options</Text>
          </View>
          <Text style={styles.stepText}>
            <Text style={styles.boldText}>Option A: Google Drive</Text>{'\n'}
            1. Upload video to Google Drive{'\n'}
            2. Right-click → Get link{'\n'}
            3. Change to &quot;Anyone with the link&quot;{'\n'}
            4. Copy the link{'\n'}
            5. Paste in Column B{'\n\n'}
            
            <Text style={styles.boldText}>Option B: Direct URLs (Recommended)</Text>{'\n'}
            Use direct video URLs from:{'\n'}
            • Cloudinary{'\n'}
            • AWS S3 (public){'\n'}
            • Firebase Storage{'\n'}
            • Any CDN with .mp4 links
          </Text>
        </View>

        <View style={styles.warningCard}>
          <IconSymbol
            ios_icon_name="exclamationmark.triangle.fill"
            android_material_icon_name="warning"
            size={32}
            color="#F59E0B"
          />
          <Text style={styles.warningTitle}>Important Notes</Text>
          <Text style={styles.warningText}>
            • Google Drive videos may have playback issues due to CORS restrictions{'\n'}
            • Direct video URLs work more reliably{'\n'}
            • Ensure videos are in MP4 format{'\n'}
            • Keep video file sizes reasonable (&lt;50MB){'\n'}
            • Test video URLs in a browser first
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <Text style={styles.stepTitle}>Troubleshooting</Text>
          </View>
          <Text style={styles.stepText}>
            If videos don&apos;t load:{'\n\n'}
            
            <Text style={styles.boldText}>Check Internet Connection</Text>{'\n'}
            Ensure you have a stable connection{'\n\n'}
            
            <Text style={styles.boldText}>Verify Sheet Access</Text>{'\n'}
            Make sure the sheet is publicly accessible{'\n\n'}
            
            <Text style={styles.boldText}>Test Video URL</Text>{'\n'}
            Open the video URL in a browser to verify it works{'\n\n'}
            
            <Text style={styles.boldText}>Check Word Spelling</Text>{'\n'}
            Ensure the word matches exactly (case-insensitive)
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Current Configuration</Text>
          <Text style={styles.infoText}>
            Sheet ID: 1pwiLjwOjnqRtEQsonVWtVt8hAMSF0qLZmY0zTlJyKc0{'\n'}
            API Key: AIzaSyAniuVYPSTBKg9VCTLpVDp7azdmD4DXdQM
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    boxShadow: '0px 2px 8px rgba(59, 130, 246, 0.1)',
    elevation: 2,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.secondary,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  section: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.border,
    boxShadow: '0px 4px 12px rgba(59, 130, 246, 0.1)',
    elevation: 2,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.card,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  stepText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  boldText: {
    fontWeight: '700',
    color: colors.text,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  warningCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FCD34D',
    alignItems: 'center',
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#92400E',
    marginTop: 12,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 22,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 18,
  },
});
