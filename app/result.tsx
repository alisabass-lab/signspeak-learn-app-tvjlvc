
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
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { colors, commonStyles } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { fetchVideoFromSheet } from "@/utils/googleSheetsHelper";

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const word = params.word as string;

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const SHEET_ID = '1pwiLjwOjnqRtEQsonVWtVt8hAMSF0qLZmY0zTlJyKc0';
  const API_KEY = 'AIzaSyAniuVYPSTBKg9VCTLpVDp7azdmD4DXdQM';

  const fetchVideo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setVideoError(null);

      console.log('Fetching video for word:', word);
      
      if (!word || word.trim() === '') {
        setError('Please enter a valid word.');
        setLoading(false);
        return;
      }

      const url = await fetchVideoFromSheet(word, SHEET_ID, API_KEY);

      if (url) {
        console.log('Video URL found:', url);
        setVideoUrl(url);
      } else {
        setError(`No sign language video found for "${word}".`);
      }
    } catch (err: any) {
      console.error('Error fetching video:', err);
      
      let errorMessage = 'Failed to load video.';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your network and try again.';
      }
      
      setError(errorMessage);
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

  // Listen for video player errors
  useEffect(() => {
    if (!player) return;

    const errorListener = (error: any) => {
      console.error('Video player error:', error);
      setVideoError('Failed to play video. The video format may not be supported or the file may be inaccessible.');
    };

    // Note: expo-video doesn't have a direct error event, but we can monitor status
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
        <View style={{ width: 48 }} />
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
            <Text style={styles.errorSubtext}>
              Please try another word or check your internet connection.
            </Text>
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
            
            <View style={styles.troubleshootBox}>
              <Text style={styles.troubleshootTitle}>Troubleshooting Tips:</Text>
              <Text style={styles.troubleshootText}>
                • Check your internet connection{'\n'}
                • Verify the word exists in the database{'\n'}
                • Ensure Google Sheet is publicly accessible{'\n'}
                • For Google Drive videos, make sure sharing is set to &quot;Anyone with the link&quot;
              </Text>
            </View>
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
  errorSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
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
  troubleshootBox: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    width: '100%',
    borderWidth: 2,
    borderColor: colors.border,
  },
  troubleshootTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  troubleshootText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: 12,
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
