/**
 * Function to get the first outbox edge bucket.
 * @param {Object} outboxEdgeStore - An object containing the outbox edge store.
 * @returns {Object} The first bucket in the outbox edge store.
 */
const getFirstOutboxEdgeBucket = outboxEdgeStore => {
  // Destructure the getBucket function from outboxEdgeStore
  const { getBucket } = outboxEdgeStore

  // Use the getBucket function to get the first bucket in the outboxEdgeStore
  return getBucket(0)
}

export default getFirstOutboxEdgeBucket
