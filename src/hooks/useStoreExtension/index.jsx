import { useEffect } from 'react'
import { useStoreApi } from '@xyflow/react'

import moveItem from './moveItem'
import addItemToStore from './addItemToStore'
import generateId from './generateId'
import addInitialItemsToStore from './addInitialItemsToStore'

/**
 * Custom hook for managing store extension.
 *
 * @param {Object} options - The options for the store extension.
 * @param {Array} options.initialItems - The initial items to add to the store.
 */
const useStoreExtension = ({ initialItems = [] }) => {
  // Get the handle to the store api
  const store = useStoreApi()

  useEffect(() => {
    // Extend the store
    store.setState(prevState => {
      // Check if the store is already extended
      const isExtended =
        prevState.items &&
        prevState.itemLookup &&
        prevState.addItem &&
        prevState.getItem

      // If the store is already extended, abort processing
      if (isExtended) return prevState

      return {
        // Keep the previous state
        ...prevState,

        // Array of items
        items: [],

        // Map of items by id
        itemLookup: new Map(),

        // Add an item to the store
        addItem: item => addItemToStore(store, item),

        // Get an item by its id
        getItem: id => store.getState().itemLookup.get(String(id)),

        // Generate an unique ID
        generateId,

        // Move an item from a node to an edge
        moveItemFromNodeToEdge: (itemId, nodeId, edgeId) =>
          moveItem(store, itemId, nodeId, edgeId, 'node', 'edge'),

        // Move an item from an edge to a node
        moveItemFromEdgeToNode: (itemId, edgeId, nodeId) =>
          moveItem(store, itemId, edgeId, nodeId, 'edge', 'node'),

        // Generic find, looks into all items, nodes, and edges by id
        find: id => {
          // convert id to lowercase
          const lowerId = String(id).toLowerCase()

          // add dashes to every 3 characters of the id
          const dashedLowerId = lowerId.replace(/(.{3})(?!$)/g, '$1-')

          // Get the lookup functions
          const { getItem, nodeLookup, edgeLookup } = store.getState()

          // Attempt to find data in a chain of lookups
          return (
            getItem(id) ||
            getItem(lowerId) ||
            getItem(dashedLowerId) ||
            nodeLookup.get(id) ||
            nodeLookup.get(lowerId) ||
            nodeLookup.get(dashedLowerId) ||
            edgeLookup.get(id) ||
            edgeLookup.get(lowerId) ||
            edgeLookup.get(dashedLowerId)
          )
        },
      }
    })

    // If we don't have the store state on window object, add the subscription
    if (!window.store) {
      // Add the store state to the window object
      window.store = store.getState()

      // Keep the window object state fresh for easier console debugging
      store.subscribe(
        s => (window.store = s),
        s => s
      )
    }

    // Add the initial items to the store
    addInitialItemsToStore(store, initialItems)
  }, [store, initialItems])
}

export default useStoreExtension
