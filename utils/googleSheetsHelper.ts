
/**
 * Google Sheets Helper for Sign Language App
 * 
 * This utility helps fetch sign language video URLs from Google Sheets.
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Google Sheets Structure:
 *    - Column A: Word/Phrase (e.g., "hello", "thank you")
 *    - Column B: Video URL (Google Drive link or direct video URL)
 *    - Row 1: Headers (will be skipped)
 * 
 * 2. Make the Google Sheet Public:
 *    - Open your Google Sheet
 *    - Click "Share" button
 *    - Change to "Anyone with the link can view"
 *    - Click "Done"
 * 
 * 3. Get the Sheet ID:
 *    - From the URL: https://docs.google.com/spreadsheets/d/SHEET_ID/edit
 *    - Copy the SHEET_ID part
 * 
 * 4. Enable Google Sheets API:
 *    - Go to Google Cloud Console (https://console.cloud.google.com)
 *    - Create a new project or select existing
 *    - Enable "Google Sheets API"
 *    - Create credentials (API Key)
 *    - Restrict the API key to Google Sheets API only
 * 
 * 5. Google Drive Video Links:
 *    - Upload videos to Google Drive
 *    - Right-click video > Get link > Change to "Anyone with the link"
 *    - Copy the link (format: https://drive.google.com/file/d/FILE_ID/view)
 *    - Paste in Column B of your Google Sheet
 * 
 * IMPORTANT: For best results, use direct video URLs from services like:
 *    - Cloudinary
 *    - AWS S3 with public access
 *    - Firebase Storage
 *    - Any CDN with direct .mp4 links
 * 
 * Google Drive videos may have playback issues due to CORS and authentication.
 * 
 * EXAMPLE SHEET DATA:
 * | Word    | Video URL                                                    |
 * |---------|--------------------------------------------------------------|
 * | hello   | https://drive.google.com/file/d/abc123/view                  |
 * | thanks  | https://drive.google.com/file/d/def456/view                  |
 * | please  | https://www.example.com/videos/please.mp4                    |
 * 
 * IMPORTANT NOTES:
 * - The Google Sheets API key provided in the app is: AIzaSyAniuVYPSTBKg9VCTLpVDp7azdmD4DXdQM
 * - The Google Sheet ID is: 1pwiLjwOjnqRtEQsonVWtVt8hAMSF0qLZmY0zTlJyKc0
 * - Make sure your Google Sheet is publicly accessible
 * - Video files should be hosted on Google Drive or a public CDN
 * - For Google Drive videos, ensure they are set to "Anyone with the link can view"
 */

export interface VideoData {
  word: string;
  videoUrl: string;
}

/**
 * Fetches a video URL from Google Sheets based on the word
 * @param word - The word to search for
 * @param sheetId - The Google Sheet ID
 * @param apiKey - The Google API key
 * @returns The video URL or null if not found
 */
export async function fetchVideoFromSheet(
  word: string,
  sheetId: string,
  apiKey: string
): Promise<string | null> {
  try {
    console.log('Fetching from Google Sheets:', { word, sheetId });
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`;
    console.log('Request URL:', url);
    
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error:', response.status, errorText);
      
      if (response.status === 403) {
        throw new Error('ACCESS_DENIED');
      } else if (response.status === 404) {
        throw new Error('SHEET_NOT_FOUND');
      } else if (response.status === 400) {
        throw new Error('INVALID_REQUEST');
      } else {
        throw new Error(`API_ERROR_${response.status}`);
      }
    }

    const data = await response.json();
    console.log('Google Sheets response:', data);
    
    const rows = data.values || [];
    
    if (rows.length === 0) {
      console.error('Google Sheet is empty');
      throw new Error('EMPTY_SHEET');
    }
    
    const searchWord = word.toLowerCase().trim();

    console.log(`Searching for word: "${searchWord}" in ${rows.length} rows`);

    // Search for the word (skip header row)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] && row[0].toLowerCase().trim() === searchWord) {
        let videoUrl = row[1];
        
        if (!videoUrl) {
          console.error('Video URL is empty for word:', searchWord);
          throw new Error('EMPTY_VIDEO_URL');
        }
        
        console.log('Found matching word at row', i, ':', videoUrl);
        
        // Convert Google Drive link to streamable format
        if (videoUrl && videoUrl.includes('drive.google.com')) {
          const fileIdMatch = videoUrl.match(/\/d\/([^/]+)/);
          if (fileIdMatch) {
            const fileId = fileIdMatch[1];
            // Try multiple Google Drive URL formats for better compatibility
            // Format 1: Direct preview (works best for streaming)
            videoUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
            console.log('Converted to Google Drive streaming link:', videoUrl);
          } else {
            console.warn('Could not extract file ID from Google Drive URL:', videoUrl);
          }
        }
        
        return videoUrl;
      }
    }

    console.log('No matching word found in sheet');
    return null;
  } catch (error) {
    console.error('Error fetching video from sheet:', error);
    throw error;
  }
}

/**
 * Converts a Google Drive sharing URL to a streamable link
 * @param driveUrl - The Google Drive sharing URL
 * @returns The streamable URL
 */
export function convertDriveUrlToDirectLink(driveUrl: string): string {
  if (driveUrl.includes('drive.google.com')) {
    const fileIdMatch = driveUrl.match(/\/d\/([^/]+)/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      // Use the preview format which works better for video streaming
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }
  return driveUrl;
}

/**
 * Validates if a URL is accessible
 * @param url - The URL to validate
 * @returns True if accessible, false otherwise
 */
export async function validateVideoUrl(url: string): Promise<boolean> {
  try {
    console.log('Validating video URL:', url);
    const response = await fetch(url, { method: 'HEAD' });
    console.log('URL validation response:', response.status);
    return response.ok;
  } catch (error) {
    console.error('Error validating URL:', error);
    return false;
  }
}

/**
 * Fetches all video data from the Google Sheet
 * @param sheetId - The Google Sheet ID
 * @param apiKey - The Google API key
 * @returns Array of video data
 */
export async function fetchAllVideos(
  sheetId: string,
  apiKey: string
): Promise<VideoData[]> {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data from Google Sheets');
    }

    const data = await response.json();
    const rows = data.values || [];
    const videos: VideoData[] = [];

    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] && row[1]) {
        let videoUrl = row[1];
        
        // Convert Google Drive links
        if (videoUrl.includes('drive.google.com')) {
          videoUrl = convertDriveUrlToDirectLink(videoUrl);
        }
        
        videos.push({
          word: row[0].trim(),
          videoUrl: videoUrl,
        });
      }
    }

    return videos;
  } catch (error) {
    console.error('Error fetching all videos:', error);
    throw error;
  }
}
