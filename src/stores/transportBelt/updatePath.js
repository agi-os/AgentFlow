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
  const { setLength, setBucketCenters, pathRef, bucketSize } = store.getState()

  // If there is no path reference, exit the function early
  if (!pathRef) return

  // Calculate the length of the path using the path reference
  const length = calculateLength(pathRef)

  // Update the length in the store's state
  setLength(length)

  // Calculate the bucket centers using the length, bucket size, and path reference
  const bucketCenters = calculateBucketCenters(length, bucketSize, pathRef)

  // Update the bucket centers in the store's state
  setBucketCenters(bucketCenters)
}

export default updatePath
