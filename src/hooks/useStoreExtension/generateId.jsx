/**
 * Generates an unique ID, default length of 6 is highly probable to be unique for over 10_000 generated IDs.
 * @param {number} [length=6] - Optional length of the generated ID.
 * @returns {string} The generated ID.
 */
const generateId = (length = 6) => {
  // Define the charset optimized for human readability with no ambiguous characters
  const charset = 'ABCDEFGHJKLMNPQRTUVWXY346789'

  // Prepare the variables for the generation
  const charsetLength = charset.length
  const maxByteValue = 256
  const maxIndex = Math.floor(maxByteValue / charsetLength) * charsetLength
  let id = ''

  // Loop until the ID reaches the desired length
  while (id.length < length) {
    // Generate a random byte
    const randomArray = new Uint8Array(1)
    window.crypto.getRandomValues(randomArray)
    const byte = randomArray[0]

    // Check if the byte is within the valid range to avoid modulo bias
    if (byte < maxIndex) {
      // Map the byte to a character from the charset
      id += charset[byte % charsetLength]
    }
  }

  // Return the generated ID in lowercase with dashes every 3 characters
  return id.replace(/(.{3})(?=.)/g, '$1-').toLowerCase()
}

export default generateId
