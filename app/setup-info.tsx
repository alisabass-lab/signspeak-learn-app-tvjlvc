
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

  const openGoogleCloudConsole = () => {
    Linking.openURL('https://console.cloud.google.com/apis/library/sheets.googleapis.com');
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
          <Text style={styles.title}>Complete Setup Guide</Text>
          <Text style={styles.subtitle}>
            Follow these steps to fix the &quot;Access denied&quot; error
          </Text>
        </View>

        <View style={styles.urgentCard}>
          <IconSymbol
            ios_icon_name="exclamationmark.triangle.fill"
            android_material_icon_name="warning"
            size={32}
            color="#DC2626"
          />
          <Text style={styles.urgentTitle}>Most Common Issue</Text>
          <Text style={styles.urgentText}>
            The Google Sheet is not publicly accessible. This is the #1 reason for the &quot;Access denied&quot; error.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Make Google Sheet Public</Text>
          </View>
          <Text style={styles.stepText}>
            This is the MOST IMPORTANT step:{'\n\n'}
            
            <Text style={styles.boldText}>Step-by-step:</Text>{'\n'}
            1. Open your Google Sheet{'\n'}
            2. Click the &quot;Share&quot; button (top right corner){'\n'}
            3. Under &quot;General access&quot;, click the dropdown{'\n'}
            4. Select &quot;Anyone with the link&quot;{'\n'}
            5. Make sure the role is set to &quot;Viewer&quot;{'\n'}
            6. Click &quot;Done&quot;{'\n\n'}
            
            <Text style={styles.boldText}>Verify it worked:</Text>{'\n'}
            The sharing settings should now show &quot;Anyone with the link can view&quot;
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
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepTitle}>Enable Google Sheets API</Text>
          </View>
          <Text style={styles.stepText}>
            The API key needs access to Google Sheets API:{'\n\n'}
            
            1. Go to Google Cloud Console{'\n'}
            2. Select your project (or create one){'\n'}
            3. Search for &quot;Google Sheets API&quot;{'\n'}
            4. Click &quot;Enable&quot;{'\n'}
            5. Wait for it to activate (may take a minute){'\n\n'}
            
            <Text style={styles.boldText}>Check API Key:</Text>{'\n'}
            • Go to Credentials section{'\n'}
            • Find your API key{'\n'}
            • Make sure it&apos;s not restricted or allows Sheets API
          </Text>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={openGoogleCloudConsole}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="link"
              android_material_icon_name="link"
              size={16}
              color={colors.primary}
            />
            <Text style={styles.linkButtonText}>Open Google Cloud Console</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepTitle}>Google Sheet Structure</Text>
          </View>
          <Text style={styles.stepText}>
            Your Google Sheet must be named &quot;Sheet1&quot; and have:{'\n\n'}
            
            <Text style={styles.boldText}>Column A:</Text> Word/Phrase{'\n'}
            <Text style={styles.boldText}>Column B:</Text> Video URL{'\n'}
            <Text style={styles.boldText}>Row 1:</Text> Headers (will be skipped){'\n\n'}
            
            <Text style={styles.boldText}>Example:</Text>{'\n'}
            | Word    | Video URL                    |{'\n'}
            |---------|------------------------------|{'\n'}
            | hello   | https://drive.google.com/... |{'\n'}
            | thanks  | https://drive.google.com/... |
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <Text style={styles.stepTitle}>Video Hosting</Text>
          </View>
          <Text style={styles.stepText}>
            <Text style={styles.boldText}>Option A: Google Drive (Simple)</Text>{'\n'}
            1. Upload video to Google Drive{'\n'}
            2. Right-click video → Get link{'\n'}
            3. Change to &quot;Anyone with the link&quot;{'\n'}
            4. Copy the link{'\n'}
            5. Paste in Column B{'\n\n'}
            
            <Text style={styles.boldText}>Option B: Direct URLs (Better)</Text>{'\n'}
            Use direct video URLs from:{'\n'}
            • Cloudinary{'\n'}
            • AWS S3 (public){'\n'}
            • Firebase Storage{'\n'}
            • Any CDN with .mp4 links{'\n\n'}
            
            <Text style={styles.warningTextInline}>Note:</Text> Google Drive videos may have playback issues due to CORS restrictions.
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
            • Both the Google Sheet AND the videos must be publicly accessible{'\n'}
            • Direct video URLs work more reliably than Google Drive{'\n'}
            • Ensure videos are in MP4 format{'\n'}
            • Keep video file sizes reasonable (&lt;50MB){'\n'}
            • Test video URLs in a browser first{'\n'}
            • Words are case-insensitive but must match exactly
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>5</Text>
            </View>
            <Text style={styles.stepTitle}>Testing Your Setup</Text>
          </View>
          <Text style={styles.stepText}>
            <Text style={styles.boldText}>Test the Google Sheet:</Text>{'\n'}
            1. Open the sheet in an incognito/private window{'\n'}
            2. You should be able to view it without signing in{'\n'}
            3. If you can&apos;t, the sharing settings are wrong{'\n\n'}
            
            <Text style={styles.boldText}>Test a Video URL:</Text>{'\n'}
            1. Copy a video URL from Column B{'\n'}
            2. Paste it in a new browser tab{'\n'}
            3. The video should load and play{'\n'}
            4. If it asks for login, the video isn&apos;t public
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Current Configuration</Text>
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Sheet ID:</Text>
            <Text style={styles.configValue}>1pwiLjwOjnqRtEQsonVWtVt8hAMSF0qLZmY0zTlJyKc0</Text>
          </View>
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>API Key:</Text>
            <Text style={styles.configValue}>AIzaSyAniuVYPSTBKg9VCTLpVDp7azdmD4DXdQM</Text>
          </View>
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Sheet Name:</Text>
            <Text style={styles.configValue}>Sheet1</Text>
          </View>
        </View>

        <View style={styles.successCard}>
          <IconSymbol
            ios_icon_name="checkmark.circle.fill"
            android_material_icon_name="check_circle"
            size={32}
            color="#10B981"
          />
          <Text style={styles.successTitle}>After Setup</Text>
          <Text style={styles.successText}>
            Once you&apos;ve completed all steps:{'\n\n'}
            1. Go back to the app{'\n'}
            2. Try searching for a word{'\n'}
            3. The video should load successfully{'\n\n'}
            If you still see errors, double-check that the Google Sheet is publicly accessible.
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
  urgentCard: {
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#DC2626',
    alignItems: 'center',
  },
  urgentTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#DC2626',
    marginTop: 12,
    marginBottom: 8,
  },
  urgentText: {
    fontSize: 15,
    color: '#7F1D1D',
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '600',
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
  warningTextInline: {
    fontWeight: '700',
    color: '#F59E0B',
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
  successCard: {
    backgroundColor: '#D1FAE5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#065F46',
    marginTop: 12,
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: '#065F46',
    lineHeight: 22,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  configRow: {
    marginBottom: 8,
  },
  configLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  configValue: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 16,
  },
});
