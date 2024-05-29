const putOnBeltHandler = ({
  putOnBelt,
  getLocationItems,
  setItem,
  edges,
  nodeId,
}) => {
  // Sanity check
  if (!edges) return
  if (!getLocationItems) return
  if (!setItem) return
  if (!nodeId) return
  if (!putOnBelt) return

  // If this node does not have an outbox, return
  if (!edges.find(e => e.source === nodeId && e.sourceHandle === 'outbox')) {
    return
  }

  // Get the next item from queue
  const nextItem = getLocationItems(nodeId)[0]

  // Sanity check
  if (!nextItem) return

  // Get the id of the edge on outbox of this node
  const edgeId = edges.find(
    e => e.sourceHandle === 'outbox' && e.source === nodeId
  ).id

  // Put the item on the belt
  putOnBelt({ itemId: nextItem.id, beltId: edgeId })
}

export default putOnBeltHandler
