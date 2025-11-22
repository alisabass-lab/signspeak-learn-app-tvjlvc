
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors, commonStyles } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

export default function InputScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mode = params.mode as string;

  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (mode === 'speak' && Platform.OS === 'web') {
      console.log('Speech mode initialized for web');
    }
  }, [mode]);

  const startListening = () => {
    if (Platform.OS === 'web') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        Alert.alert('Not Supported', 'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        console.log('Speech recognition started');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
        console.log('Recognized text:', transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        Alert.alert('Error', 'Failed to recognize speech. Please try again.');
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log('Speech recognition ended');
      };

      recognition.start();
    } else {
      Alert.alert(
        'Native Platform',
        'Speech recognition on mobile requires additional native modules. For now, please use the text input option or try on web browser.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleTranslate = () => {
    if (!text.trim()) {
      Alert.alert('Empty Input', 'Please enter or speak a word first.');
      return;
    }

    router.push(`/result?word=${encodeURIComponent(text.trim())}`);
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
        <Text style={styles.headerTitle}>
          {mode === 'speak' ? 'Speak a Word' : 'Type a Word'}
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputSection}>
          <Text style={styles.label}>
            {mode === 'speak' ? 'Speak or type your word:' : 'Enter your word or phrase:'}
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="e.g., hello, thank you, good morning..."
              placeholderTextColor={colors.textSecondary}
              value={text}
              onChangeText={setText}
              multiline
              autoFocus={mode === 'type'}
              editable={!isListening}
            />
          </View>
        </View>

        {mode === 'speak' && (
          <TouchableOpacity
            style={[styles.micButton, isListening && styles.micButtonActive]}
            onPress={startListening}
            activeOpacity={0.7}
            disabled={isListening}
          >
            <View style={[styles.micIconContainer, isListening && styles.micIconContainerActive]}>
              <IconSymbol
                ios_icon_name={isListening ? "waveform" : "mic.fill"}
                android_material_icon_name="mic"
                size={48}
                color={colors.card}
              />
            </View>
            <Text style={styles.micButtonText}>
              {isListening ? 'Listening...' : 'Tap to Speak'}
            </Text>
            {isListening && (
              <Text style={styles.micButtonSubtext}>
                Speak clearly into your microphone
              </Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.translateButton, !text.trim() && styles.translateButtonDisabled]}
          onPress={handleTranslate}
          activeOpacity={0.7}
          disabled={!text.trim()}
        >
          <Text style={styles.translateButtonText}>Translate to Sign Language</Text>
          <IconSymbol
            ios_icon_name="arrow.right.circle.fill"
            android_material_icon_name="arrow_forward"
            size={24}
            color={colors.card}
          />
        </TouchableOpacity>

        {Platform.OS !== 'web' && mode === 'speak' && (
          <View style={styles.infoBox}>
            <IconSymbol
              ios_icon_name="info.circle.fill"
              android_material_icon_name="info"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.infoText}>
              Speech recognition works best on web browsers. On mobile, please use the text input.
            </Text>
          </View>
        )}
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
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: colors.border,
    padding: 20,
    minHeight: 160,
    boxShadow: '0px 4px 12px rgba(180, 111, 80, 0.1)',
    elevation: 2,
  },
  input: {
    fontSize: 20,
    color: colors.text,
    minHeight: 120,
    textAlignVertical: 'top',
    fontWeight: '500',
  },
  micButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    boxShadow: '0px 8px 24px rgba(180, 111, 80, 0.3)',
    elevation: 6,
    borderWidth: 3,
    borderColor: colors.accent,
  },
  micButtonActive: {
    backgroundColor: colors.accent,
  },
  micIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  micIconContainerActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  micButtonText: {
    color: colors.card,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  micButtonSubtext: {
    color: colors.card,
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.9,
  },
  translateButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    boxShadow: '0px 8px 24px rgba(180, 111, 80, 0.3)',
    elevation: 6,
    borderWidth: 3,
    borderColor: colors.accent,
  },
  translateButtonDisabled: {
    backgroundColor: colors.textSecondary,
    borderColor: colors.textSecondary,
    opacity: 0.5,
  },
  translateButtonText: {
    color: colors.card,
    fontSize: 20,
    fontWeight: '800',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    gap: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    lineHeight: 20,
  },
});
