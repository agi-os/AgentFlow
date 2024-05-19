/**
 * Adds initial items to the store.
 *
 * @param {Object} store - The store object.
 * @param {Array} initialItems - The array of initial items to be added.
 */
const addInitialItemsToStore = ({ setItem, initialItems }) => {
  // Sanity check
  if (!setItem || typeof setItem !== 'function') return

  // Sanity check
  if (!initialItems || !Array.isArray(initialItems)) return

  // Loop through the initial items and add them to the store
  initialItems.forEach(item => setItem(item))
}

export default addInitialItemsToStore
