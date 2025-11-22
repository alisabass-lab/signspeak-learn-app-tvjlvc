
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

export default function CameraInputScreen() {
  const router = useRouter();

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
        <Text style={styles.headerTitle}>Camera Input</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.featureContainer}>
          <View style={styles.iconContainer}>
            <IconSymbol
              ios_icon_name="video.fill"
              android_material_icon_name="videocam"
              size={80}
              color={colors.primary}
            />
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>Coming Soon</Text>
          </View>

          <Text style={styles.title}>Sign Language Recognition</Text>
          <Text style={styles.subtitle}>
            Use your camera to translate sign language to text or speech
          </Text>

          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>Planned Features:</Text>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <IconSymbol
                  ios_icon_name="video.fill"
                  android_material_icon_name="videocam"
                  size={24}
                  color={colors.primary}
                />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureItemTitle}>Real-time Recognition</Text>
                <Text style={styles.featureItemText}>
                  Capture sign language gestures using your device camera
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <IconSymbol
                  ios_icon_name="text.bubble.fill"
                  android_material_icon_name="chat_bubble"
                  size={24}
                  color={colors.teal}
                />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureItemTitle}>Text Translation</Text>
                <Text style={styles.featureItemText}>
                  Convert recognized signs to written text instantly
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <IconSymbol
                  ios_icon_name="speaker.wave.3.fill"
                  android_material_icon_name="volume_up"
                  size={24}
                  color={colors.accent}
                />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureItemTitle}>Speech Output</Text>
                <Text style={styles.featureItemText}>
                  Hear the translated text spoken aloud with text-to-speech
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIconContainer}>
                <IconSymbol
                  ios_icon_name="brain.head.profile"
                  android_material_icon_name="psychology"
                  size={24}
                  color={colors.yellow}
                />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureItemTitle}>AI-Powered</Text>
                <Text style={styles.featureItemText}>
                  Advanced machine learning for accurate gesture recognition
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <IconSymbol
              ios_icon_name="info.circle.fill"
              android_material_icon_name="info"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.infoText}>
              This feature is currently under development. We&apos;re working on integrating 
              advanced AI models to provide accurate sign language recognition.
            </Text>
          </View>

          <View style={styles.techCard}>
            <Text style={styles.techTitle}>Technology Stack:</Text>
            <View style={styles.techList}>
              <Text style={styles.techItem}>• Computer Vision (OpenCV)</Text>
              <Text style={styles.techItem}>• Machine Learning (TensorFlow)</Text>
              <Text style={styles.techItem}>• Hand Tracking (MediaPipe)</Text>
              <Text style={styles.techItem}>• Natural Language Processing</Text>
              <Text style={styles.techItem}>• Text-to-Speech Engine</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.notifyButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="bell.fill"
              android_material_icon_name="notifications"
              size={24}
              color={colors.card}
            />
            <Text style={styles.notifyButtonText}>Notify Me When Available</Text>
          </TouchableOpacity>
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
    boxShadow: '0px 2px 8px rgba(180, 111, 80, 0.1)',
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
  featureContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: colors.border,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    width: '100%',
    borderWidth: 2,
    borderColor: colors.border,
    boxShadow: '0px 4px 12px rgba(180, 111, 80, 0.15)',
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureItemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  featureItemText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
    borderWidth: 2,
    borderColor: colors.border,
    width: '100%',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    lineHeight: 20,
  },
  techCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    width: '100%',
    borderWidth: 2,
    borderColor: colors.border,
  },
  techTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  techList: {
    gap: 8,
  },
  techItem: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 20,
  },
  notifyButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    boxShadow: '0px 4px 12px rgba(180, 111, 80, 0.3)',
    elevation: 4,
    width: '100%',
    borderWidth: 3,
    borderColor: colors.accent,
  },
  notifyButtonText: {
    color: colors.card,
    fontSize: 18,
    fontWeight: '800',
  },
});
