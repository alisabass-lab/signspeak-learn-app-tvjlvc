
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_QUESTIONS_KEY = '@sign_language_recent_questions';
const MAX_RECENT_QUESTIONS = 20;

export interface RecentQuestion {
  word: string;
  timestamp: number;
}

/**
 * Save a question to recent history
 */
export async function saveRecentQuestion(word: string): Promise<void> {
  try {
    const trimmedWord = word.trim().toLowerCase();
    
    // Get existing questions
    const existing = await getRecentQuestions();
    
    // Remove duplicate if exists
    const filtered = existing.filter(q => q.word.toLowerCase() !== trimmedWord);
    
    // Add new question at the beginning
    const updated: RecentQuestion[] = [
      { word: trimmedWord, timestamp: Date.now() },
      ...filtered,
    ].slice(0, MAX_RECENT_QUESTIONS);
    
    // Save to storage
    await AsyncStorage.setItem(RECENT_QUESTIONS_KEY, JSON.stringify(updated));
    console.log('Saved recent question:', trimmedWord);
  } catch (error) {
    console.error('Error saving recent question:', error);
  }
}

/**
 * Get all recent questions
 */
export async function getRecentQuestions(): Promise<RecentQuestion[]> {
  try {
    const data = await AsyncStorage.getItem(RECENT_QUESTIONS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error getting recent questions:', error);
    return [];
  }
}

/**
 * Clear all recent questions
 */
export async function clearRecentQuestions(): Promise<void> {
  try {
    await AsyncStorage.removeItem(RECENT_QUESTIONS_KEY);
    console.log('Cleared recent questions');
  } catch (error) {
    console.error('Error clearing recent questions:', error);
  }
}

/**
 * Remove a specific question from history
 */
export async function removeRecentQuestion(word: string): Promise<void> {
  try {
    const existing = await getRecentQuestions();
    const filtered = existing.filter(q => q.word.toLowerCase() !== word.toLowerCase());
    await AsyncStorage.setItem(RECENT_QUESTIONS_KEY, JSON.stringify(filtered));
    console.log('Removed recent question:', word);
  } catch (error) {
    console.error('Error removing recent question:', error);
  }
}
