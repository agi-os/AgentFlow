import { useNodeId, useStore } from '@xyflow/react'

/**
 * Custom hook to get the items associated with the current node.
 * @returns {Array} The items associated with the current node.
 */
const useNodeItems = () => {
  // Get the current node id
  const nodeId = useNodeId()

  // Get the getLocationItemsSorted function from the store
  const getLocationItemsSorted = useStore(s => s.getLocationItemsSorted)

  // Sanity check
  if (!nodeId || !getLocationItemsSorted) {
    return []
  }

  // Return sorted items for the current node
  return getLocationItemsSorted(nodeId) || []
}

export default useNodeItems
