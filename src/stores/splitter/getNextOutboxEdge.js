/**
 * Function to get the next outbox edge.
 * @param {Object} params - An object containing the necessary parameters.
 * @param {Array} params.outboxEdgeIds - An array of outbox edge IDs.
 * @param {number} params.lastOutboxIndex - The index of the last outbox edge that was processed.
 * @param {Function} params.setLastOutboxIndex - A function to set the index of the last outbox edge that was processed.
 * @returns {string} The ID of the next outbox edge.
 */
const getNextOutboxEdge = ({
  outboxEdgeIds,
  lastOutboxIndex,
  setLastOutboxIndex,
}) => {
  // Calculate the next outbox index
  const outboxIndex = (lastOutboxIndex + 1) % outboxEdgeIds.length

  // Set the lastOutboxIndex to the new outboxIndex
  setLastOutboxIndex(outboxIndex)

  // Return the outbox edge at the new outboxIndex
  return outboxEdgeIds[outboxIndex]
}

export default getNextOutboxEdge
