
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { colors, commonStyles } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? 48 : 0 }]}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
});
