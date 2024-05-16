/**
 * Updates the item location lookup in the store.
 * @param {Object} store - The store object.
 */
const updateItemLocationLookup = store => {
  store.setState(draft => {
    // Create a new lookup map
    const itemLocationLookup = new Map()

    // Iterate over the items and generate buckets for each location
    const locations = new Set(draft.items.map(item => item.location.id))

    // Initialize the lookup map with the location ids
    locations.forEach(locationId => {
      const itemIds = draft.items
        .filter(item => item.location.id === locationId)
        .map(item => item.id)

      itemLocationLookup.set(locationId, itemIds)
    })

    // Update the store with the new data
    return {
      ...draft,
      itemLocationLookup,
    }
  })
}

export default updateItemLocationLookup
