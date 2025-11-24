
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { colors, commonStyles } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? 48 : 0 }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/b6dc9000-fa54-434e-a5e2-caecec84a816.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={commonStyles.title}>Sign Language Helper</Text>
            <Text style={[commonStyles.text, styles.subtitle]}>
              Learn sign language by typing or speaking words
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/input?mode=type')}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <IconSymbol
                  ios_icon_name="keyboard"
                  android_material_icon_name="keyboard"
                  size={56}
                  color={colors.card}
                />
              </View>
              <Text style={styles.buttonText}>Type a Word</Text>
              <Text style={styles.buttonSubtext}>Enter text to translate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/input?mode=speak')}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <IconSymbol
                  ios_icon_name="mic.fill"
                  android_material_icon_name="mic"
                  size={56}
                  color={colors.card}
                />
              </View>
              <Text style={styles.buttonText}>Speak a Word</Text>
              <Text style={styles.buttonSubtext}>Use voice to translate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/recent-questions')}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <IconSymbol
                  ios_icon_name="clock.fill"
                  android_material_icon_name="history"
                  size={56}
                  color={colors.card}
                />
              </View>
              <Text style={styles.buttonText}>Recent Questions</Text>
              <Text style={styles.buttonSubtext}>View your search history</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.disabledButton]}
              onPress={() => router.push('/camera-input')}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <IconSymbol
                  ios_icon_name="video.fill"
                  android_material_icon_name="videocam"
                  size={56}
                  color={colors.textSecondary}
                />
              </View>
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Coming Soon</Text>
              </View>
              <Text style={[styles.buttonText, styles.disabledText]}>Camera Input</Text>
              <Text style={[styles.buttonSubtext, styles.disabledText]}>
                Sign language recognition
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.setupLink}
            onPress={() => router.push('/setup-info')}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="info.circle"
              android_material_icon_name="info"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.setupLinkText}>
              Videos not loading? View setup guide
            </Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 160,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    minHeight: 800,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 12,
    maxWidth: 400,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 500,
    gap: 16,
  },
  button: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 8px 24px rgba(180, 111, 80, 0.2)',
    elevation: 6,
    minHeight: 140,
    borderWidth: 3,
    borderColor: colors.border,
    position: 'relative',
  },
  disabledButton: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  buttonSubtext: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  disabledText: {
    color: colors.textSecondary,
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonText: {
    color: colors.card,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  setupLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  setupLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
