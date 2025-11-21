
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  background: '#FFFFFF',      // White background
  text: '#1E3A8A',            // Dark blue text
  textSecondary: '#64748B',   // Gray secondary text
  primary: '#3B82F6',         // Bright blue primary
  secondary: '#DBEAFE',       // Light blue secondary
  accent: '#2563EB',          // Darker blue accent
  card: '#FFFFFF',            // White cards
  border: '#E0E7FF',          // Light blue border
  success: '#10B981',         // Green for success
  error: '#EF4444',           // Red for errors
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 28,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 2,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 4px 12px rgba(59, 130, 246, 0.15)',
    elevation: 3,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
});
