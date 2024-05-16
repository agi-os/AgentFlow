/**
 * Updates the item lookup map in the store.
 * @param {Object} store - The store object.
 */
const updateItemLookup = store => {
  store.setState(draft => {
    // Create a new lookup map
    const itemLookup = new Map()

    // Populate the lookup map with the items
    draft.items.forEach(item => itemLookup.set(item.id, item))

    // Update the store with the new data
    return {
      ...draft,
      itemLookup,
    }
  })
}

export default updateItemLookup
