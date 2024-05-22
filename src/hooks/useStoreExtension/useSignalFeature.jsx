// File: ./useStoreExtension/useSignalFeature.jsx
import { useEffect } from 'react'
import { useStore, useStoreApi } from '@xyflow/react'

/**
 * Custom hook to retrieve a list of signal nodes connected to a specific node.
 *
 * @returns {function(nodeId: string): Object[]} A function that takes a node ID as input
 * and returns an array of connected signal nodes.
 */
const useSignalFeature = () => {
  // Get reference to store API
  const { setState } = useStoreApi()

  // Fetch all required store items
  const getNode = useStore(s => s.getNode)
  const getNodeEdges = useStore(s => s.getNodeEdges)
  const getSignalNodes = useStore(s => s.getSignalNodes)

  useEffect(() => {
    // If the function already exists in the store, abort
    if (typeof getSignalNodes === 'function') return

    // Check for all required features to be available
    if (typeof getNode !== 'function') return
    if (typeof getNodeEdges !== 'function') return

    // Add the getSignalNodes function to the store
    setState(draft => ({
      ...draft,
      /**
       * Retrieves a list of signal nodes connected to a specific node.
       *
       * @param {string} nodeId - The ID of the node.
       * @returns {Object[]} An array of connected signal nodes.
       */
      getSignalNodes: nodeId => {
        // Get all edges connected to the node
        const edges = getNodeEdges(nodeId)

        // Filter out the edges carrying items
        const signalEdges = edges.filter(edge => edge.type !== 'queue')

        const connectedNodes = signalEdges.reduce((acc, edge) => {
          // Determine the ID of the connected node based on the edge's source and target
          const connectedNodeId =
            edge.source === nodeId ? edge.target : edge.source

          // Retrieve the connected node using the getNode function
          const connectedNode = getNode(connectedNodeId)

          // Add the retrieved node to the accumulator array
          acc.push(connectedNode)

          // Return the updated accumulator for the next iteration
          return acc
        }, []) // Initialize the accumulator as an empty array

        // Return the connected signal nodes
        return connectedNodes
      },
    }))
  }, [getSignalNodes, getNode, getNodeEdges, setState])
}

export default useSignalFeature
