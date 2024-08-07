/**
 * Formats a given number of seconds into a human-readable MM:SS format.
 *
 * @param {number} seconds - The number of seconds to format.
 * @returns {string} The formatted time string in the format MM:SS.
 */
export const formatSeconds = seconds => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds
  ).padStart(2, '0')}`
}
