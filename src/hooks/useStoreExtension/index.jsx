import { useEffect } from 'react'
import { useStoreApi } from '@xyflow/react'

import moveItem from './moveItem'
import addItemToStore from './addItemToStore'
import generateId from './generateId'
import addInitialItemsToStore from './addInitialItemsToStore'
import lookup from './lookup'

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

        // Generic lookup, looks into all items, nodes, and edges by id
        lookup: id => lookup(id, store),

        // Array of items
        items: [],

        // Map of items by id
        itemLookup: new Map(),

        // Add an item to the store
        addItem: item => addItemToStore(store, item),

        // Get an item by its id
        getItem: id => store.getState().itemLookup.get(id),

        // Get an edge by its id
        getEdge: id => store.getState().edgeLookup.get(id),

        // Get a node by its id
        getNode: id => store.getState().nodeLookup.get(id),

        // Generate an unique ID
        generateId,

        // Move an item from a node to an edge
        moveItemFromNodeToEdge: ({ itemId, nodeId, edgeId }) =>
          moveItem({
            store,
            itemId,
            fromId: nodeId,
            toId: edgeId,
            fromType: 'node',
            toType: 'edge',
          }),

        // Move an item from an edge to a node
        moveItemFromEdgeToNode: ({ itemId, edgeId, nodeId }) =>
          moveItem({
            store,
            itemId,
            fromId: edgeId,
            toId: nodeId,
            fromType: 'edge',
            toType: 'node',
          }),
      }
    })

    // If we don't have the store state on window object, add a subscription
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
