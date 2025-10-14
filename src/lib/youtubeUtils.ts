// Extract YouTube video ID from various URL formats
export const extractVideoId = (url: string): string | null => {
  if (!url) return null;

  // Match standard YouTube URL (youtube.com/watch?v=VIDEO_ID)
  const standardMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/watch\?.*v=)([^&?/\s]+)/
  );
  if (standardMatch?.[1]) {
    return standardMatch[1];
  }

  // Match YouTube shorts URL (youtube.com/shorts/VIDEO_ID)
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^&?/\s]+)/);
  if (shortsMatch?.[1]) {
    return shortsMatch[1];
  }

  return null;
};

// Validate a YouTube URL
export const isValidYouTubeUrl = (url: string): boolean => {
  if (!url) return false;
  return Boolean(extractVideoId(url));
};

// Validate batch URLs input
export const validateBatchUrls = (
  urls: string[]
): { valid: string[]; invalid: string[] } => {
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const url of urls) {
    if (isValidYouTubeUrl(url.trim())) {
      valid.push(url.trim());
    } else {
      invalid.push(url.trim());
    }
  }

  return { valid, invalid };
};
