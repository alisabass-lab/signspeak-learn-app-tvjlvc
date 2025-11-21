
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

export interface DiagnosticResult {
  success: boolean;
  message: string;
  details?: any;
  suggestions?: string[];
}

/**
 * Tests the Google Sheets API connection
 * @param sheetId - The Google Sheet ID
 * @param apiKey - The Google API key
 * @returns Diagnostic result with details
 */
export async function testGoogleSheetsConnection(
  sheetId: string,
  apiKey: string
): Promise<DiagnosticResult> {
  try {
    console.log('=== TESTING GOOGLE SHEETS CONNECTION ===');
    console.log('Sheet ID:', sheetId);
    console.log('API Key:', apiKey.substring(0, 10) + '...');

    // Test 1: Check if we can reach Google Sheets API
    const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}`;
    console.log('Test URL:', testUrl);

    const response = await fetch(testUrl);
    const responseText = await response.text();
    
    console.log('Response Status:', response.status);
    console.log('Response Headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));
    console.log('Response Body:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse error response:', e);
        errorData = { message: responseText };
      }

      const suggestions: string[] = [];

      if (response.status === 403) {
        suggestions.push('Make sure the Google Sheet is set to "Anyone with the link can view"');
        suggestions.push('Verify the API key has Google Sheets API enabled');
        suggestions.push('Check if the API key has any restrictions that might block access');
        
        return {
          success: false,
          message: 'Access Denied (403)',
          details: errorData,
          suggestions,
        };
      } else if (response.status === 404) {
        suggestions.push('Verify the Sheet ID is correct');
        suggestions.push('Make sure the Google Sheet exists and is not deleted');
        suggestions.push('Check if the sheet URL is: https://docs.google.com/spreadsheets/d/' + sheetId);
        
        return {
          success: false,
          message: 'Sheet Not Found (404)',
          details: errorData,
          suggestions,
        };
      } else if (response.status === 400) {
        suggestions.push('The API request format may be incorrect');
        suggestions.push('Verify the API key is valid');
        
        return {
          success: false,
          message: 'Bad Request (400)',
          details: errorData,
          suggestions,
        };
      } else if (response.status === 429) {
        suggestions.push('Too many requests - wait a moment and try again');
        suggestions.push('Consider implementing rate limiting in your app');
        
        return {
          success: false,
          message: 'Rate Limited (429)',
          details: errorData,
          suggestions,
        };
      } else {
        return {
          success: false,
          message: `API Error (${response.status})`,
          details: errorData,
          suggestions: ['Check the error details for more information'],
        };
      }
    }

    const data = JSON.parse(responseText);
    console.log('Sheet metadata retrieved successfully:', data.properties?.title);

    // Test 2: Try to fetch actual data
    const dataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:B?key=${apiKey}`;
    console.log('Fetching data from:', dataUrl);
    
    const dataResponse = await fetch(dataUrl);
    const dataText = await dataResponse.text();
    
    console.log('Data Response Status:', dataResponse.status);
    console.log('Data Response Body:', dataText);

    if (!dataResponse.ok) {
      let errorData;
      try {
        errorData = JSON.parse(dataText);
      } catch (e) {
        console.error('Failed to parse data error response:', e);
        errorData = { message: dataText };
      }

      return {
        success: false,
        message: 'Failed to fetch sheet data',
        details: errorData,
        suggestions: [
          'Make sure the sheet is named "Sheet1"',
          'Verify columns A and B exist',
          'Check if the sheet has any data',
        ],
      };
    }

    const sheetData = JSON.parse(dataText);
    const rowCount = sheetData.values?.length || 0;

    console.log('Successfully fetched data. Row count:', rowCount);

    return {
      success: true,
      message: `Connection successful! Found ${rowCount} rows in the sheet.`,
      details: {
        sheetTitle: data.properties?.title,
        rowCount,
        sampleData: sheetData.values?.slice(0, 3),
      },
    };

  } catch (error: any) {
    console.error('Connection test error:', error);
    
    return {
      success: false,
      message: 'Network or connection error',
      details: {
        error: error.message,
        stack: error.stack,
      },
      suggestions: [
        'Check your internet connection',
        'Make sure you can access https://sheets.googleapis.com',
        'Try disabling any VPN or proxy',
      ],
    };
  }
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
    console.log('=== FETCHING VIDEO FROM GOOGLE SHEETS ===');
    console.log('Word:', word);
    console.log('Sheet ID:', sheetId);
    console.log('API Key:', apiKey.substring(0, 10) + '...');
    
    // Use the correct range format: Sheet1!A:B
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:B?key=${apiKey}`;
    console.log('Request URL:', url);
    
    const response = await fetch(url);
    const responseText = await response.text();

    console.log('Response Status:', response.status);
    console.log('Response Status Text:', response.statusText);

    if (!response.ok) {
      console.error('API Error Response:', responseText);
      
      let errorData;
      try {
        errorData = JSON.parse(responseText);
        console.error('Parsed Error Data:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        console.error('Could not parse error response as JSON');
        errorData = { message: responseText };
      }
      
      if (response.status === 403) {
        console.error('403 Forbidden - Sheet may not be public or API key lacks permissions');
        throw new Error('ACCESS_DENIED');
      } else if (response.status === 404) {
        console.error('404 Not Found - Sheet ID may be incorrect');
        throw new Error('SHEET_NOT_FOUND');
      } else if (response.status === 400) {
        console.error('400 Bad Request - Request format may be incorrect');
        throw new Error('INVALID_REQUEST');
      } else {
        console.error(`${response.status} Error - Unexpected API error`);
        throw new Error(`API_ERROR_${response.status}`);
      }
    }

    const data = JSON.parse(responseText);
    console.log('Successfully fetched data from Google Sheets');
    console.log('Response data keys:', Object.keys(data));
    
    const rows = data.values || [];
    console.log('Total rows:', rows.length);
    
    if (rows.length === 0) {
      console.error('Google Sheet is empty - no data found');
      throw new Error('EMPTY_SHEET');
    }

    if (rows.length === 1) {
      console.warn('Only header row found - no data rows');
      throw new Error('EMPTY_SHEET');
    }
    
    const searchWord = word.toLowerCase().trim();
    console.log(`Searching for word: "${searchWord}"`);

    // Log first few rows for debugging
    console.log('First 3 rows:', JSON.stringify(rows.slice(0, 3), null, 2));

    // Search for the word (skip header row)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      if (!row || row.length === 0) {
        console.log(`Row ${i}: Empty row, skipping`);
        continue;
      }

      const rowWord = row[0]?.toString().toLowerCase().trim();
      console.log(`Row ${i}: Comparing "${rowWord}" with "${searchWord}"`);
      
      if (rowWord === searchWord) {
        let videoUrl = row[1]?.toString();
        
        if (!videoUrl || videoUrl.trim() === '') {
          console.error(`Row ${i}: Video URL is empty for word "${searchWord}"`);
          throw new Error('EMPTY_VIDEO_URL');
        }
        
        console.log(`Row ${i}: MATCH FOUND! Video URL:`, videoUrl);
        
        // Convert Google Drive link to streamable format
        if (videoUrl.includes('drive.google.com')) {
          const fileIdMatch = videoUrl.match(/\/d\/([^/]+)/);
          if (fileIdMatch) {
            const fileId = fileIdMatch[1];
            const originalUrl = videoUrl;
            videoUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
            console.log('Converted Google Drive URL:');
            console.log('  Original:', originalUrl);
            console.log('  Converted:', videoUrl);
          } else {
            console.warn('Could not extract file ID from Google Drive URL:', videoUrl);
          }
        }
        
        return videoUrl;
      }
    }

    console.log('No matching word found in sheet');
    console.log('Available words:', rows.slice(1).map(r => r[0]).filter(Boolean).join(', '));
    return null;
  } catch (error: any) {
    console.error('=== ERROR FETCHING VIDEO ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
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
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:B?key=${apiKey}`
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
