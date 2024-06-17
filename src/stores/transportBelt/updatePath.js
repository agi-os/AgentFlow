import getStore from '.'
import calculateBucketCenters from './calculateBucketCenters'
import calculateLength from './calculateLength'

/**
 * Updates the length and bucket centers based on the path data and reference.
 *
 * @param {string} id - The ID of the store to update.
 * @returns {void}
 */
const updatePath = id => {
  // Get the store for the given ID
  const store = getStore(id)

  // Destructure the necessary functions and values from the store's state
  const { setLength, getBucket, pathRef, bucketSize, setBuckets, buckets } =
    store.getState()

  // If there is no path reference, exit the function early
  if (!pathRef) return

  // Calculate the length of the path using the path reference
  const length = calculateLength(pathRef)

  // Update the length in the store's state
  setLength(length)

  // Calculate the bucket centers using the length, bucket size, and path reference
  const bucketCenters = calculateBucketCenters(length, bucketSize, pathRef)

  // Update coordinates in stores of each bucket
  bucketCenters.forEach((center, index) => {
    // Get a reference to the bucket's store function using the index
    const { setCoordinates } = getBucket(index)
    // Update the coordinates
    setCoordinates(center)
  })

  // If we have overflow buckets, shift all items to the beginning of the array, then trim the end
  if (buckets.length > bucketCenters.length) {
    // Shift all items to the beginning of the array

    // Find all items that are not null
    const allItemIds = buckets
      .map(bucket => bucket.getState().itemId)
      .filter(Boolean)
    console.log('allItemIds', allItemIds)

    // Set all buckets to null itemId
    buckets.forEach(bucket => bucket.getState().setItemId(null))

    // Reset the item index to first bucket available
    allItemIds.forEach((itemId, index) => {
      const { setItemId } = getBucket(index)
      setItemId(itemId)
    })

    // Trim the array to the desired length
    const trimmedBuckets = buckets.slice(0, bucketCenters.length)

    // Update the buckets in the store's state
    setBuckets(trimmedBuckets)
  }
}

export default updatePath
