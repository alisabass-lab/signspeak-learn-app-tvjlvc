
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { colors, commonStyles } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { fetchVideoFromSheet, testGoogleSheetsConnection } from "@/utils/googleSheetsHelper";

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const word = params.word as string;

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null);

  const SHEET_ID = '1pwiLjwOjnqRtEQsonVWtVt8hAMSF0qLZmY0zTlJyKc0';
  const API_KEY = 'AIzaSyAniuVYPSTBKg9VCTLpVDp7azdmD4DXdQM';

  const runDiagnostics = async () => {
    console.log('Running diagnostics...');
    const result = await testGoogleSheetsConnection(SHEET_ID, API_KEY);
    setDiagnosticInfo(result);
    
    if (result.success) {
      Alert.alert(
        'Connection Successful! ✅',
        result.message + '\n\nDetails:\n' + JSON.stringify(result.details, null, 2),
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Connection Failed ❌',
        result.message + '\n\nSuggestions:\n' + (result.suggestions?.join('\n') || 'No suggestions'),
        [{ text: 'OK' }]
      );
    }
  };

  const fetchVideo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setErrorType(null);
      setVideoError(null);

      console.log('Fetching video for word:', word);
      
      if (!word || word.trim() === '') {
        setError('Please enter a valid word.');
        setErrorType('INVALID_INPUT');
        setLoading(false);
        return;
      }

      const url = await fetchVideoFromSheet(word, SHEET_ID, API_KEY);

      if (url) {
        console.log('Video URL found:', url);
        setVideoUrl(url);
      } else {
        setError(`No sign language video found for "${word}".`);
        setErrorType('WORD_NOT_FOUND');
      }
    } catch (err: any) {
      console.error('Error fetching video:', err);
      
      let errorMessage = 'Failed to load video.';
      let errorTypeValue = 'UNKNOWN';
      
      if (err.message === 'ACCESS_DENIED') {
        errorMessage = 'Access denied. Please check that the Google Sheet is publicly accessible and the API key is valid.';
        errorTypeValue = 'ACCESS_DENIED';
      } else if (err.message === 'SHEET_NOT_FOUND') {
        errorMessage = 'Google Sheet not found. Please verify the Sheet ID is correct.';
        errorTypeValue = 'SHEET_NOT_FOUND';
      } else if (err.message === 'INVALID_REQUEST') {
        errorMessage = 'Invalid API request. Please check the API configuration.';
        errorTypeValue = 'INVALID_REQUEST';
      } else if (err.message === 'EMPTY_SHEET') {
        errorMessage = 'The Google Sheet is empty or has no data rows.';
        errorTypeValue = 'EMPTY_SHEET';
      } else if (err.message === 'EMPTY_VIDEO_URL') {
        errorMessage = `Video URL not found for "${word}". Please add a video URL in the Google Sheet.`;
        errorTypeValue = 'EMPTY_VIDEO_URL';
      } else if (err.message && err.message.startsWith('API_ERROR_')) {
        errorMessage = `API Error: ${err.message.replace('API_ERROR_', '')}`;
        errorTypeValue = 'API_ERROR';
      } else if (err.message) {
        errorMessage = err.message;
      } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network.';
        errorTypeValue = 'NO_INTERNET';
      }
      
      setError(errorMessage);
      setErrorType(errorTypeValue);
    } finally {
      setLoading(false);
    }
  }, [word, SHEET_ID, API_KEY]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  const player = useVideoPlayer(videoUrl || '', (player) => {
    if (videoUrl) {
      player.loop = true;
      player.play();
    }
  });

  useEffect(() => {
    if (!player) return;

    const errorListener = (error: any) => {
      console.error('Video player error:', error);
      setVideoError('Failed to play video. The video format may not be supported or the file may be inaccessible.');
    };

    const checkPlayerStatus = setInterval(() => {
      if (videoUrl && player.status === 'error') {
        errorListener({ message: 'Video playback error' });
      }
    }, 1000);

    return () => {
      clearInterval(checkPlayerStatus);
    };
  }, [player, videoUrl]);

  const { isPlaying } = useEvent(player, 'playingChange', { 
    isPlaying: player.playing 
  });

  const togglePlayPause = () => {
    try {
      if (isPlaying) {
        player.pause();
      } else {
        player.play();
      }
    } catch (err) {
      console.error('Error toggling play/pause:', err);
      Alert.alert('Error', 'Failed to control video playback.');
    }
  };

  const handleTryAnother = () => {
    router.back();
  };

  const handleRetry = () => {
    fetchVideo();
  };

  const openGoogleSheet = () => {
    Linking.openURL(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`);
  };

  const openSetupGuide = () => {
    router.push('/setup-info');
  };

  const renderErrorDetails = () => {
    if (errorType === 'ACCESS_DENIED') {
      return (
        <View style={styles.errorDetailsContainer}>
          <View style={styles.errorDetailCard}>
            <Text style={styles.errorDetailTitle}>Why am I seeing this error?</Text>
            <Text style={styles.errorDetailText}>
              The Google Sheet is not publicly accessible or the API key doesn&apos;t have permission to access it.
            </Text>
          </View>

          <View style={styles.errorDetailCard}>
            <Text style={styles.errorDetailTitle}>How to fix:</Text>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>1.</Text>
              <Text style={styles.stepText}>Open the Google Sheet</Text>
            </View>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>2.</Text>
              <Text style={styles.stepText}>Click the &quot;Share&quot; button (top right)</Text>
            </View>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>3.</Text>
              <Text style={styles.stepText}>Under &quot;General access&quot;, select &quot;Anyone with the link&quot;</Text>
            </View>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>4.</Text>
              <Text style={styles.stepText}>Make sure it&apos;s set to &quot;Viewer&quot;</Text>
            </View>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>5.</Text>
              <Text style={styles.stepText}>Click &quot;Done&quot; and try again</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={openGoogleSheet}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="link"
              android_material_icon_name="link"
              size={20}
              color={colors.card}
            />
            <Text style={styles.actionButtonText}>Open Google Sheet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryActionButton]}
            onPress={runDiagnostics}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="stethoscope"
              android_material_icon_name="bug_report"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.actionButtonText, styles.secondaryActionButtonText]}>
              Run Diagnostics
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryActionButton]}
            onPress={openSetupGuide}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="book.fill"
              android_material_icon_name="menu_book"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.actionButtonText, styles.secondaryActionButtonText]}>
              View Setup Guide
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (errorType === 'SHEET_NOT_FOUND') {
      return (
        <View style={styles.errorDetailsContainer}>
          <View style={styles.errorDetailCard}>
            <Text style={styles.errorDetailTitle}>Sheet not found</Text>
            <Text style={styles.errorDetailText}>
              The Google Sheet ID may be incorrect or the sheet may have been deleted.
            </Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxLabel}>Current Sheet ID:</Text>
            <Text style={styles.infoBoxValue}>{SHEET_ID}</Text>
          </View>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryActionButton]}
            onPress={runDiagnostics}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="stethoscope"
              android_material_icon_name="bug_report"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.actionButtonText, styles.secondaryActionButtonText]}>
              Run Diagnostics
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (errorType === 'WORD_NOT_FOUND') {
      return (
        <View style={styles.errorDetailsContainer}>
          <View style={styles.errorDetailCard}>
            <Text style={styles.errorDetailTitle}>Word not in database</Text>
            <Text style={styles.errorDetailText}>
              The word &quot;{word}&quot; was not found in the Google Sheet. Try a different word or add it to the sheet.
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryActionButton]}
            onPress={runDiagnostics}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="stethoscope"
              android_material_icon_name="bug_report"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.actionButtonText, styles.secondaryActionButtonText]}>
              Check Connection
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.errorDetailsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryActionButton]}
          onPress={runDiagnostics}
          activeOpacity={0.7}
        >
          <IconSymbol
            ios_icon_name="stethoscope"
            android_material_icon_name="bug_report"
            size={20}
            color={colors.primary}
          />
          <Text style={[styles.actionButtonText, styles.secondaryActionButtonText]}>
            Run Diagnostics
          </Text>
        </TouchableOpacity>
      </View>
    );
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
        <Text style={styles.headerTitle}>Sign Language</Text>
        <TouchableOpacity
          style={styles.diagnosticButton}
          onPress={runDiagnostics}
          activeOpacity={0.7}
        >
          <IconSymbol
            ios_icon_name="stethoscope"
            android_material_icon_name="bug_report"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.wordContainer}>
          <Text style={styles.wordLabel}>Word / Phrase:</Text>
          <Text style={styles.wordText}>{word}</Text>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading sign language video...</Text>
            <Text style={styles.loadingSubtext}>Please wait a moment</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <View style={styles.errorIconContainer}>
              <IconSymbol
                ios_icon_name="exclamationmark.triangle.fill"
                android_material_icon_name="error"
                size={56}
                color={colors.error}
              />
            </View>
            <Text style={styles.errorText}>{error}</Text>
            
            {renderErrorDetails()}
            
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRetry}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="arrow.clockwise"
                android_material_icon_name="refresh"
                size={20}
                color={colors.card}
              />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && !error && videoUrl && (
          <React.Fragment>
            <View style={styles.videoSection}>
              <Text style={styles.videoLabel}>Sign Language Video:</Text>
              
              {videoError && (
                <View style={styles.videoErrorBox}>
                  <IconSymbol
                    ios_icon_name="exclamationmark.circle.fill"
                    android_material_icon_name="error"
                    size={24}
                    color={colors.error}
                  />
                  <Text style={styles.videoErrorText}>{videoError}</Text>
                </View>
              )}
              
              <View style={styles.videoContainer}>
                <VideoView
                  style={styles.video}
                  player={player}
                  allowsFullscreen
                  allowsPictureInPicture
                  nativeControls={false}
                  contentFit="contain"
                />
              </View>

              <View style={styles.controls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={togglePlayPause}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    ios_icon_name={isPlaying ? "pause.circle.fill" : "play.circle.fill"}
                    android_material_icon_name={isPlaying ? "pause_circle" : "play_circle"}
                    size={36}
                    color={colors.card}
                  />
                  <Text style={styles.controlButtonText}>
                    {isPlaying ? 'Pause' : 'Play'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => player.replay()}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    ios_icon_name="arrow.clockwise.circle.fill"
                    android_material_icon_name="replay_circle_filled"
                    size={36}
                    color={colors.card}
                  />
                  <Text style={styles.controlButtonText}>Replay</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.infoBox}>
                <IconSymbol
                  ios_icon_name="info.circle.fill"
                  android_material_icon_name="info"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.infoText}>
                  Watch the video carefully and practice the sign language gesture.
                </Text>
              </View>
              
              <View style={styles.urlDebugBox}>
                <Text style={styles.urlDebugLabel}>Video URL:</Text>
                <Text style={styles.urlDebugText} numberOfLines={2}>
                  {videoUrl}
                </Text>
              </View>
            </View>
          </React.Fragment>
        )}

        <TouchableOpacity
          style={styles.tryAnotherButton}
          onPress={handleTryAnother}
          activeOpacity={0.7}
        >
          <IconSymbol
            ios_icon_name="arrow.left.circle.fill"
            android_material_icon_name="arrow_back"
            size={24}
            color={colors.text}
          />
          <Text style={styles.tryAnotherButtonText}>Try Another Word</Text>
        </TouchableOpacity>
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
  diagnosticButton: {
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
  wordContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.border,
    boxShadow: '0px 4px 12px rgba(59, 130, 246, 0.15)',
    elevation: 3,
  },
  wordLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  wordText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 40,
    borderWidth: 3,
    borderColor: colors.border,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 40,
    borderWidth: 3,
    borderColor: colors.border,
  },
  errorIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  errorDetailsContainer: {
    width: '100%',
    marginTop: 20,
  },
  errorDetailCard: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  errorDetailTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  errorDetailText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    marginTop: 8,
    paddingLeft: 8,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 8,
    minWidth: 20,
  },
  stepText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
    width: '100%',
  },
  actionButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryActionButton: {
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  secondaryActionButtonText: {
    color: colors.primary,
  },
  infoBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoBoxLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoBoxValue: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  retryButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '700',
  },
  videoSection: {
    marginBottom: 24,
  },
  videoLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  videoErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  videoErrorText: {
    flex: 1,
    fontSize: 13,
    color: colors.error,
    fontWeight: '600',
  },
  videoContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: colors.border,
    aspectRatio: 16 / 9,
    boxShadow: '0px 8px 24px rgba(59, 130, 246, 0.2)',
    elevation: 6,
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 12,
  },
  controlButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(59, 130, 246, 0.3)',
    elevation: 4,
    borderWidth: 3,
    borderColor: colors.accent,
  },
  controlButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    lineHeight: 20,
  },
  urlDebugBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  urlDebugLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  urlDebugText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tryAnotherButton: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    boxShadow: '0px 4px 12px rgba(59, 130, 246, 0.15)',
    elevation: 3,
    borderWidth: 3,
    borderColor: colors.border,
  },
  tryAnotherButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
});
