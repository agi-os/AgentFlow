import getFirstOutboxEdgeBucket from './getFirstOutboxEdgeBucket'

/**
 * Function to move an item from the inbox edge store to the outbox edge store.
 * @param {Object} params - An object containing the necessary parameters.
 * @param {Object} params.inboxEdgeState - An object containing the inbox edge store.
 * @param {Object} params.outboxEdgeState - An object containing the outbox edge store.
 * @param {string} params.lastInboxEdgeBucketItemId - The ID of the last item in the inbox edge bucket.
 */
const moveItem = ({
  inboxEdgeState,
  outboxEdgeState,
  lastInboxEdgeBucketItemId,
}) => {
  // Sanity check
  if (!lastInboxEdgeBucketItemId) return

  // Destructure the getBucket function and inboxBuckets array from inboxEdgeState
  const { getBucket, buckets } = inboxEdgeState

  // Get the first bucket in the outboxEdgeState
  const firstOutboxEdgeBucket = getFirstOutboxEdgeBucket(outboxEdgeState)

  // Set the itemId of the last bucket in the inboxEdgeState to null
  getBucket(buckets.length - 1).setItemId(null)

  // Set the itemId of the first bucket in the outboxEdgeState to the lastInboxEdgeBucketItemId
  firstOutboxEdgeBucket.setItemId(lastInboxEdgeBucketItemId)

  // Get a handle to the item in the first bucket of the outboxEdgeState
  const item = firstOutboxEdgeBucket.item().getState()

  // If no item is present, return early
  if (!item) return

  // Get references to functions on the item store in the first bucket of the outboxEdgeState
  const { setLocationId, setLocationIndex, setCoordinates } = item

  // Set the locationId of the item in the first bucket of the outboxEdgeState to the id of the outboxEdgeState
  setLocationId(outboxEdgeState.id)

  // Set the locationIndex of the item in the first bucket of the outboxEdgeState to 0
  setLocationIndex(0)

  // Set the coordinates of the item in the first bucket of the outboxEdgeState to the coordinates of the first bucket
  setCoordinates(firstOutboxEdgeBucket.coordinates)
}

export default moveItem
