import getLocationItems from './getLocationItems'

/**
 * Retrieves items from a store based on a location ID, sorts them by distance, and if distances are equal, sorts by delivery time.
 * @param {Object} options - An object containing store and locationId.
 * @param {Object} options.store - An object representing the store with getItem and itemLocationLookup.
 * @param {number|string} options.locationId - Identifier for fetching items specific to a location.
 * @returns {Array} - Sorted array of items based on distance and deliveryTime.
 */
const getLocationItemsSorted = ({ store, locationId }) => {
  // Get the items for the location
  const items = getLocationItems({ store, locationId })

  // Sort the items by distance, and if distances are equal, sort by deliveryTime
  items.sort((a, b) => {
    const aDeliveryTime = a.location.deliveryTime ?? 0
    const bDeliveryTime = b.location.deliveryTime ?? 0

    const distanceDifference =
      (a.location.distance ?? 0) - (b.location.distance ?? 0)

    if (distanceDifference === 0) {
      return aDeliveryTime - bDeliveryTime
    }

    return distanceDifference
  })

  return items
}

export default getLocationItemsSorted
