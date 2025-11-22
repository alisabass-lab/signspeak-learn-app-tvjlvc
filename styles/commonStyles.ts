
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Theme inspired by the warm, playful design from the provided image
export const colors = {
  background: '#F5E6D3',      // Warm beige background
  text: '#2C1810',            // Dark brown text
  textSecondary: '#8B6F47',   // Medium brown secondary text
  primary: '#D4845C',         // Warm terracotta/orange primary
  secondary: '#E8D4C0',       // Light beige secondary
  accent: '#B86F50',          // Darker terracotta accent
  card: '#FFFFFF',            // White cards
  border: '#D4B5A0',          // Tan border
  success: '#7FB069',         // Muted green for success
  error: '#D64545',           // Warm red for errors
  teal: '#5FA8A8',            // Teal accent from theme
  yellow: '#F4C430',          // Warm yellow accent
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
    boxShadow: '0px 4px 12px rgba(180, 111, 80, 0.15)',
    elevation: 3,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
});
