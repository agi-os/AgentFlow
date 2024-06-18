/**
 * Function to get the next inbox edge.
 * @param {Object} params - An object containing the necessary parameters.
 * @param {Array} params.inboxEdgeIds - An array of inbox edge IDs.
 * @param {number} params.lastInboxIndex - The index of the last inbox edge that was processed.
 * @param {Function} params.setLastInboxIndex - A function to set the index of the last inbox edge that was processed.
 * @returns {string} The ID of the next inbox edge.
 */
const getNextInboxEdge = ({
  inboxEdgeIds,
  lastInboxIndex,
  setLastInboxIndex,
}) => {
  // Calculate the next inbox index
  const inboxIndex = (lastInboxIndex + 1) % inboxEdgeIds.length

  // Set the lastInboxIndex to the new inboxIndex
  setLastInboxIndex(inboxIndex)

  // Return the inbox edge at the new inboxIndex
  return inboxEdgeIds[inboxIndex]
}

export default getNextInboxEdge
