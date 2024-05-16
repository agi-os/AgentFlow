/**
 * Adds initial items to the store.
 *
 * @param {Object} store - The store object.
 * @param {Array} initialItems - The array of initial items to be added.
 */
const addInitialItemsToStore = ({ store, initialItems }) => {
  // Sanity check
  if (!initialItems || !Array.isArray(initialItems)) return

  // Get a handle to the add item function
  const addItem = store.getState().addItem

  // Loop through the initial items and add them to the store
  initialItems.forEach(item => addItem(item))
}

export default addInitialItemsToStore
