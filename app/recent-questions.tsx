
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import {
  getRecentQuestions,
  clearRecentQuestions,
  removeRecentQuestion,
  RecentQuestion,
} from "@/utils/recentQuestionsHelper";
import { useFocusEffect } from "@react-navigation/native";

export default function RecentQuestionsScreen() {
  const router = useRouter();
  const [questions, setQuestions] = useState<RecentQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await getRecentQuestions();
      setQuestions(data);
      console.log('Loaded recent questions:', data.length);
    } catch (error) {
      console.error('Error loading recent questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadQuestions();
    }, [])
  );

  const handleClearAll = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all recent questions?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearRecentQuestions();
            setQuestions([]);
          },
        },
      ]
    );
  };

  const handleRemoveQuestion = (word: string) => {
    Alert.alert(
      'Remove Question',
      `Remove "${word}" from history?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeRecentQuestion(word);
            await loadQuestions();
          },
        },
      ]
    );
  };

  const handleQuestionPress = (word: string) => {
    router.push(`/result?word=${encodeURIComponent(word)}`);
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    const date = new Date(timestamp);
    return date.toLocaleDateString();
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
        <Text style={styles.headerTitle}>Recent Questions</Text>
        {questions.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearAll}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="trash.fill"
              android_material_icon_name="delete"
              size={24}
              color={colors.error}
            />
          </TouchableOpacity>
        )}
        {questions.length === 0 && <View style={{ width: 48 }} />}
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {loading && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Loading...</Text>
          </View>
        )}

        {!loading && questions.length === 0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <IconSymbol
                ios_icon_name="clock.fill"
                android_material_icon_name="history"
                size={64}
                color={colors.textSecondary}
              />
            </View>
            <Text style={styles.emptyTitle}>No Recent Questions</Text>
            <Text style={styles.emptySubtext}>
              Your recently searched words will appear here
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => router.push('/(tabs)/(home)/')}
              activeOpacity={0.7}
            >
              <Text style={styles.startButtonText}>Start Searching</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && questions.length > 0 && (
          <React.Fragment>
            <View style={styles.infoCard}>
              <IconSymbol
                ios_icon_name="info.circle.fill"
                android_material_icon_name="info"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.infoText}>
                Tap any word to view its sign language video again
              </Text>
            </View>

            <View style={styles.questionsList}>
              {questions.map((item, index) => (
                <View key={index} style={styles.questionItem}>
                  <TouchableOpacity
                    style={styles.questionContent}
                    onPress={() => handleQuestionPress(item.word)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.questionIconContainer}>
                      <IconSymbol
                        ios_icon_name="hand.raised.fill"
                        android_material_icon_name="waving_hand"
                        size={28}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.questionTextContainer}>
                      <Text style={styles.questionWord}>{item.word}</Text>
                      <Text style={styles.questionTime}>
                        {formatTimestamp(item.timestamp)}
                      </Text>
                    </View>
                    <IconSymbol
                      ios_icon_name="chevron.right"
                      android_material_icon_name="chevron_right"
                      size={24}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveQuestion(item.word)}
                    activeOpacity={0.7}
                  >
                    <IconSymbol
                      ios_icon_name="xmark.circle.fill"
                      android_material_icon_name="cancel"
                      size={24}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </React.Fragment>
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
  clearButton: {
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
  emptyContainer: {
    flex: 1,
    minHeight: 400,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    boxShadow: '0px 4px 12px rgba(180, 111, 80, 0.3)',
    elevation: 4,
  },
  startButtonText: {
    color: colors.card,
    fontSize: 18,
    fontWeight: '800',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
  questionsList: {
    gap: 12,
  },
  questionItem: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(180, 111, 80, 0.1)',
    elevation: 2,
  },
  questionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  questionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionTextContainer: {
    flex: 1,
  },
  questionWord: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  questionTime: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
});
