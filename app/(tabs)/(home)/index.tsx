
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { colors, commonStyles } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? 48 : 0 }]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => router.push('/setup-info')}
          activeOpacity={0.7}
        >
          <IconSymbol
            ios_icon_name="questionmark.circle.fill"
            android_material_icon_name="help"
            size={28}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <IconSymbol
            ios_icon_name="hand.raised.fill"
            android_material_icon_name="waving_hand"
            size={64}
            color={colors.primary}
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
                color={colors.primary}
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
                color={colors.primary}
              />
            </View>
            <Text style={styles.buttonText}>Speak a Word</Text>
            <Text style={styles.buttonSubtext}>Use voice to translate</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  helpButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.secondary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 140,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 12,
    maxWidth: 400,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 500,
    gap: 24,
  },
  button: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 8px 24px rgba(59, 130, 246, 0.2)',
    elevation: 6,
    minHeight: 180,
    borderWidth: 3,
    borderColor: colors.border,
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
  buttonText: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
  },
  buttonSubtext: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  setupLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 32,
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
