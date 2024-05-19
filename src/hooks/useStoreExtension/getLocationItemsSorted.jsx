import getLocationItems from './getLocationItems'

/**
 * Retrieves and sorts the items for a specific location.
 * @param {Object} options - The options for retrieving and sorting the items.
 * @param {Object} options.store - The store object.
 * @param {string} options.locationId - The ID of the location.
 * @returns {Array} The sorted items for the location.
 */
const getLocationItemsSorted = ({ store, locationId }) => {
  // Get the items for the location
  const items = getLocationItems({ store, locationId })

  // Sort the items by distance
  items.sort((a, b) => a.location.distance - b.location.distance)

  // Return the sorted items
  return items
}

export default getLocationItemsSorted
