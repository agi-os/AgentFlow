// File: ./useStoreExtension/useNodeEdgesFeature.jsx
import { useEffect } from 'react'
import { useStore, useStoreApi } from '@xyflow/react'
import debounce from './debounce'

/**
 * Custom hook for adding node edge functionality to the store.
 */
const useNodeEdgesFeature = () => {
  // Get the handle to the store api
  const store = useStoreApi()

  // Get the node edge lookup map from the store
  const nodeEdgeLookupType = useStore(s => typeof s.nodeEdgeLookup)

  // Add the node edge lookup map to the store
  useEffect(() => {
    // Sanity check
    if (!store) return

    // If the map already exists in the store, abort
    if (nodeEdgeLookupType === 'object') return

    // Update the store with the new map of item locations
    store.setState(draft => ({
      ...draft,
      nodeEdgeLookup: new Map(),
    }))
  }, [nodeEdgeLookupType, store])

  // Get the getNodeEdges function from the store
  const getNodeEdges = useStore(s => s.getNodeEdges)

  // Add the getNodeEdges function to the store
  useEffect(() => {
    // Sanity check
    if (!store) return

    // If the function already exists in the store, abort
    if (typeof getNodeEdges === 'function') return

    // Add the getNodeEdges function to the store
    store.setState(draft => ({
      ...draft,
      /**
       * Retrieves a list of edges connected to a specific node.
       *
       * @param {string} nodeId - The ID of the node.
       * @returns {Object[]} An array of connected edges.
       */
      getNodeEdges: nodeId =>
        store
          .getState()
          .edges.filter(
            edge => edge.source === nodeId || edge.target === nodeId
          ),
    }))
  }, [store, getNodeEdges])

  // Get the updateNodeEdgeLookup function from the store
  const updateNodeEdgeLookup = useStore(s => s.updateNodeEdgeLookup)

  // Add the updateNodeEdgeLookup function to the store
  useEffect(() => {
    // Sanity check
    if (!store) return

    // If the function already exists in the store, abort
    if (typeof updateNodeEdgeLookup === 'function') return

    // Add the updateNodeEdgeLookup function to the store
    store.setState(draft => ({
      ...draft,
      /**
       * Updates the node edge lookup map.
       */
      updateNodeEdgeLookup: debounce('updateNodeEdgeLookup', () => {
        // Get the existing nodeEdgeLookup map
        const nodeEdgeLookup = store.getState().nodeEdgeLookup

        store.getState().nodes.forEach(node => {
          // Prepare the new value for the nodeEdgeLookup value
          const newValue = store.getState().getNodeEdges(node.id)

          const stringifiedOldValue = JSON.stringify(
            nodeEdgeLookup.get(node.id)
          )
          const stringifiedNewValue = JSON.stringify(newValue)

          // Abort if the new value is the same as the old value
          if (
            stringifiedOldValue === stringifiedNewValue ||
            stringifiedNewValue === '[]'
          ) {
            return
          }

          // Update the nodeEdgeLookup map with the new value
          nodeEdgeLookup.set(node.id, newValue)
        })

        // Update the store with the new nodeEdgeLookup map
        store.setState(draft => ({
          ...draft,
          nodeEdgeLookup,
        }))
      }),
    }))
  }, [store, updateNodeEdgeLookup])
}

export default useNodeEdgesFeature
