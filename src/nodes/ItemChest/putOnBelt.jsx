const putOnBelt = ({ getLocationItemsSorted, setItem, edges, nodeId }) => {
  // Sanity check
  if (!edges) return
  if (!getLocationItemsSorted) return
  if (!setItem) return
  if (!nodeId) return

  if (!edges.find(e => e.source === nodeId && e.sourceHandle === 'outbox')) {
    return
  }

  // Get the next item from queue
  const nextItem = getLocationItemsSorted(nodeId)[0]

  // Sanity check
  if (!nextItem) return

  // Get the id of the edge on outbox of this node
  const edgeId = edges.find(
    e => e.sourceHandle === 'outbox' && e.source === nodeId
  ).id

  // Update the location of the item to the output belt
  const updatedItem = {
    ...nextItem,
    location: { ...nextItem?.location, id: edgeId, distance: 0 },
  }

  // Add the updated item to the store
  setItem(updatedItem)
}

export default putOnBelt
