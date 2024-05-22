import { useEffect } from 'react'
import { useStore, useStoreApi } from '@xyflow/react'

/**
 * Custom hook to manage signal nodes and their connections within the store.
 */
const useSignalFeature = () => {
  // Get reference to store API
  const { getState, setState } = useStoreApi()

  // Fetch all required store items
  const getNode = useStore(s => s.getNode)
  const getNodeEdges = useStore(s => s.getNodeEdges)
  const signalNodeLookup = useStore(s => s.signalNodeLookup)
  const getSignalNodes = useStore(s => s.getSignalNodes)

  // useEffect to add signalNodeLookup to the store
  useEffect(() => {
    // Sanity check
    if (!setState) return

    // If the map already exists in the store, abort
    if (signalNodeLookup) return

    // Add the signalNodeLookup map to the store
    setState(draft => ({
      ...draft,
      signalNodeLookup: new Map(),
    }))
  }, [signalNodeLookup, setState])

  // useEffect to add getSignalNodes to the store
  useEffect(() => {
    // Sanity check
    if (!setState) return

    // If the function already exists in the store, abort
    if (getSignalNodes) return

    // Check for all required features to be available
    if (
      typeof getNode !== 'function' ||
      typeof getNodeEdges !== 'function' ||
      typeof signalNodeLookup !== 'object'
    ) {
      return
    }

    // Add the getSignalNodes function to the store
    setState(draft => ({
      ...draft,
      /**
       * Retrieves a list of signal nodes connected to a specific node,
       * updating the signalNodeLookup map only when necessary.
       *
       * @param {string} nodeId - The ID of the node.
       * @returns {Object[]} An array of connected signal nodes.
       */
      getSignalNodes: nodeId => {
        // Get the existing signal nodes for this nodeId
        const existingSignalNodes =
          getState().signalNodeLookup.get(nodeId) || []

        // Get all edges connected to the node
        const edges = getNodeEdges(nodeId)

        // Filter out the edges representing belts with items
        const signalEdges = edges.filter(edge => edge.type !== 'queue')

        // Generate a map of connected node IDs from signalEdges
        const connectedNodeIds = new Set(
          signalEdges.map(edge => {
            return edge.source === nodeId ? edge.target : edge.source
          })
        )

        // Get IDs from existingSignalNodes for comparison
        const existingNodeIds = new Set(existingSignalNodes.map(n => n.id))

        // Check if signal edges have changed by comparing the sets
        const signalEdgesChanged =
          existingSignalNodes.length !== connectedNodeIds.size ||
          [...connectedNodeIds].some(id => !existingNodeIds.has(id))

        // If signal edges haven't changed, return the cached signal nodes
        if (!signalEdgesChanged) return existingSignalNodes

        // Create a new array of connected nodes using the connectedNodeIds
        const connectedNodes = [...connectedNodeIds].map(nodeId =>
          getNode(nodeId)
        )

        // Update the signalNodeLookup map with the new connectedNodes
        signalNodeLookup.set(nodeId, connectedNodes)

        // Return the connected signal nodes
        return connectedNodes
      },
    }))
  }, [
    getNode,
    getNodeEdges,
    getSignalNodes,
    getState,
    setState,
    signalNodeLookup,
  ])
}

export default useSignalFeature
