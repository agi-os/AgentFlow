/**
 * Retrieves the items associated with a specific location from the store.
 * @param {Object} options - The options object.
 * @param {Object} options.store - The store object.
 * @param {string} options.locationId - The ID of the location.
 * @returns {Array} The items associated with the location.
 */
const getLocationItems = ({ store, locationId }) => {
  // Extract the needed functions from the store
  const { getItem, itemLocationLookup } = store.getState()

  // Sanity check
  if (!getItem || !itemLocationLookup) {
    return []
  }

  // Get the item ids for the location
  const itemIds = itemLocationLookup.get(locationId) || []

  // Map the item ids to items
  const items = itemIds.map(id => getItem(id))

  // Return the items
  return items
}

export default getLocationItems
