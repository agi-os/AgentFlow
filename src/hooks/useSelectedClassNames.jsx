import { useNodeId, useStore } from '@xyflow/react'

/**
 * Custom hook that returns an array of class names based on the selected state.
 * @returns {string[]} The array of class names.
 */
const useSelectedClassNames = () => {
  // Get the node ID
  const nodeId = useNodeId()

  // Get the selected state
  const selected = useStore(store => !!store.getNode(nodeId)?.selected)

  // Prepare the class names based on the selected state
  const selectedClassNames = selected
    ? ['outline-offset-8', 'outline-1', 'hover:outline-2']
    : ['outline-offset-0', 'outline-0', 'hover:outline-1']

  // Return the class names
  return [
    'outline',
    'outline-orange-900',
    'transition-all',
    'transition-duration-1000',
    ...selectedClassNames,
  ]
}

export default useSelectedClassNames
