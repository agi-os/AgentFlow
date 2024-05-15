/**
 * Looks up an item in the store based on the provided ID with fallbacks when direct lookup fails.
 *
 * @param {string} id - The ID of the item to look up.
 * @param {object} store - The store object containing the lookup functions.
 * @returns {object|null} - The found item, or null if not found.
 */
const lookup = (id, store) => {
  // If the ID is not a string, return null
  if (typeof id !== 'string') return null

  // Get the lookup functions
  const { getItem, getNode, getEdge } = store.getState()

  // Attempt to find data in a chain of lookups directly
  const result = getItem(id) || getNode(id) || getEdge(id)

  // If the result is found, return it
  if (result) return result

  // Direct lookup failed, fallback to alternative lookups

  // Convert id to lowercase
  const lowerId = String(id).toLowerCase()

  // Add dashes to every 3 characters of the id
  const dashedLowerId = lowerId.replace(/(.{3})(?!$)/g, '$1-')

  // Attempt to find data in a chain of lookups
  return (
    getItem(lowerId) ||
    getItem(dashedLowerId) ||
    getNode(lowerId) ||
    getNode(dashedLowerId) ||
    getEdge(lowerId) ||
    getEdge(dashedLowerId)
  )
}

export default lookup
