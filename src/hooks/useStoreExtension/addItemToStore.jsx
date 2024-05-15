/**
 * Adds an item to the store.
 *
 * @param {Object} store - The store object.
 * @param {Object} item - The item to add to the store.
 */
const addItemToStore = (store, item) => {
  // Get a handle to the store state
  const state = store.getState()

  // If item does not have an id
  if (!item.id) {
    // Check if there are no items in the store with the same content
    const existingItem = state.items.find(existingItem => {
      // Stringify items without the id property
      const existingItemString = JSON.stringify(existingItem, (key, value) =>
        key === 'id' ? undefined : value
      )
      // Compare the stringified content
      return existingItemString === JSON.stringify(item)
    })

    // If there is an item with the same values, skip adding it to the store
    if (existingItem) return

    // Generate a random id for the item without an id
    item.id = state.generateId()
  }

  // If the item is already in the store, do not add it again
  if (state.getItem(item.id)) return

  // Save changes to the store
  store.setState(prevState => ({
    ...prevState,
    items: [...prevState.items, item],
    itemLookup: new Map([...prevState.itemLookup, [String(item.id), item]]),
  }))
}

export default addItemToStore
