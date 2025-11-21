
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
    
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error:', response.status, errorText);
      throw new Error(`Failed to fetch data from Google Sheets: ${response.status}`);
    }

    const data = await response.json();
    console.log('Google Sheets response:', data);
    
    const rows = data.values || [];
    const searchWord = word.toLowerCase().trim();

    console.log(`Searching for word: "${searchWord}" in ${rows.length} rows`);

    // Search for the word (skip header row)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] && row[0].toLowerCase().trim() === searchWord) {
        let videoUrl = row[1];
        console.log('Found matching word at row', i, ':', videoUrl);
        
        // Convert Google Drive link to direct video link
        if (videoUrl && videoUrl.includes('drive.google.com')) {
          const fileIdMatch = videoUrl.match(/\/d\/([^\/]+)/);
          if (fileIdMatch) {
            const fileId = fileIdMatch[1];
            // Use the Google Drive preview URL which works better for video playback
            videoUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
            console.log('Converted to direct link:', videoUrl);
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
 * Converts a Google Drive sharing URL to a direct download link
 * @param driveUrl - The Google Drive sharing URL
 * @returns The direct download URL
 */
export function convertDriveUrlToDirectLink(driveUrl: string): string {
  if (driveUrl.includes('drive.google.com')) {
    const fileIdMatch = driveUrl.match(/\/d\/([^\/]+)/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }
  return driveUrl;
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
