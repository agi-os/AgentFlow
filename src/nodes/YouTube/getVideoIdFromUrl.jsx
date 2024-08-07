/**
 * Retrieves the video ID from a given YouTube URL.
 *
 * @param {string} url - The YouTube URL to extract the video ID from.
 * @returns {string|null} The extracted video ID, or null if the URL is not in a recognizable format.
 */
export const getVideoIdFromUrl = url => {
  try {
    const parsedUrl = new URL(url)
    const videoIdFromSearchParams = parsedUrl.searchParams.get('v')

    // Check if the URL is in the shortened format (https://youtu.be/XXXXX)
    if (!videoIdFromSearchParams && parsedUrl.host === 'youtu.be') {
      return parsedUrl.pathname.slice(1) // Remove the leading '/' from the pathname
    }

    return videoIdFromSearchParams
  } catch (e) {
    return null
  }
}
