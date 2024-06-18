/**
 * Function to get the last inbox edge bucket item ID.
 * @param {Object} inboxEdgeState - An object containing the inbox edge store.
 * @returns {string} The ID of the last item in the inbox edge bucket.
 */
const getLastInboxEdgeBucketItemId = inboxEdgeState => {
  // Destructure the getBucket and buckets properties from inboxEdgeState
  const { getBucket, buckets } = inboxEdgeState

  // Check if buckets is defined and has at least one element
  if (!buckets || buckets.length === 0) {
    // If not, return null or an appropriate value
    return null
  }

  // Get the last bucket in the buckets array
  const lastInboxEdgeBucketItemId = getBucket(buckets.length - 1).itemId

  // Return the last item ID
  return lastInboxEdgeBucketItemId
}

export default getLastInboxEdgeBucketItemId
