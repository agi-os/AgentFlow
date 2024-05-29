import { useNodeId, useStore } from '@xyflow/react'

/**
 * Custom hook to get the items associated with the current node.
 * @returns {Array} The items associated with the current node.
 */
const useNodeItems = () => {
  // Get the current node id
  const nodeId = useNodeId()

  // Get the getLocationItems function from the store
  const getLocationItems = useStore(s => s.getLocationItems)

  // Sanity check
  if (!nodeId || !getLocationItems) {
    return []
  }

  // Return sorted items for the current node
  return getLocationItems(nodeId) || []
}

export default useNodeItems
