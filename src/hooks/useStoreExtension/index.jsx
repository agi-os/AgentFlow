import { useMemo, useEffect } from 'react'

import generateId from './generateId'
import addInitialItemsToStore from './addInitialItemsToStore'
import { useStore, useStoreApi } from '@xyflow/react'
import debounce from './debounce'

import addItem from './addItem'
import updateItemLocationLookup from './updateItemLocationLookup'
import updateItemLookup from './updateItemLookup'
import _getLocationItems from './getLocationItems'
import getLocationItemsSorted from './getLocationItemsSorted'
import lookup from './lookup'
import useTickFeature from './useTickFeature'
import useBeltDriveFeature from './useBeltDriveFeature'

/**
 * Custom hook that enhances the store with additional functionality.
 * @param {Object} options - The options for the enhanced store.
 * @param {Array} options.initialItems - The initial items to add to the store.
 * @returns {Object} - The enhanced store object.
 */
const useEnhancedStore = ({ initialItems }) => {
  const store = useStoreApi()

  // Extend the store with custom methods
  useEffect(() => {
    // Sanity check
    if (!store) return

    // If the store has been extended previously, abort
    if (store.getState().generateId) return

    // Initialize the store with the new methods
    store.setState(draft => ({
      ...draft,

      // Tick length in ms, this is base unit of all operations, 16.666ms = 60fps
      tickLength: 50,

      // System wide speed of all belts
      speed: 1000,

      setSpeed: debounce(speed =>
        store.setState(draft => {
          console.log('Setting speed from', draft.speed, 'to', speed)
          return {
            ...draft,
            speed: parseFloat(speed),
          }
        }, 200)
      ),

      // List of all belts
      beltIds: [],

      // Id of the setInterval loop calling beltDriveTick
      beltDriveIntervalId: null,

      items: [],
      addItem: item => addItem({ store, item }),
      setItem: item => addItem({ store, item }),

      itemLookup: new Map(),
      updateItemLookup: debounce(() => updateItemLookup(store)),
      getItem: id => store.getState().itemLookup.get(id),
      removeItem: id => {
        store.getState().itemLookup.delete(id)
        store.setState(draft => ({
          ...draft,
          items: draft.items.filter(item => item.id !== id),
        }))
        store.getState().updateItemLookup()
        store.getState().updateItemLocationLookup()
      },

      itemLocationLookup: new Map(),
      updateItemLocationLookup: debounce(() => updateItemLocationLookup(store)),
      getLocationItems: locationId => _getLocationItems({ store, locationId }),
      getLocationItemsSorted: locationId =>
        getLocationItemsSorted({ store, locationId }),

      generateId,
      getNode: id => store.getState().nodeLookup.get(id),
      getEdge: id => store.getState().edgeLookup.get(id),
      lookup: id => lookup({ store, id }),

      nodeEdgeLookup: new Map(),

      // Get all edges connected to the node
      getNodeEdges: nodeId =>
        store
          .getState()
          .edges.filter(
            edge => edge.source === nodeId || edge.target === nodeId
          ),

      // Update the nodeEdgeLookup map
      updateNodeEdgeLookup: debounce(() => {
        // Get the existing nodeEdgeLookup map
        const nodeEdgeLookup = store.getState().nodeEdgeLookup

        store.getState().nodes.forEach(node => {
          // Prepare the new value for the nodeEdgeLookup value
          const newValue = store.getState().getNodeEdges(node.id)

          // Abort if the new value is the same as the old value
          if (
            JSON.stringify(nodeEdgeLookup.get(node.id)) ===
            JSON.stringify(newValue)
          )
            return

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
  }, [store])

  // Extend the store with the tick functionality
  useTickFeature()

  // Extend the store with the belt drive functionality
  useBeltDriveFeature()

  // Get the current tick
  const tickCounter = useStore(s => s.tickCounter)
  const updateNodeEdgeLookup = useStore(s => s.updateNodeEdgeLookup)

  // Update node edges on every 50th tick
  useEffect(() => {
    if (tickCounter % 50 !== 0) return
    updateNodeEdgeLookup()
  }, [tickCounter, updateNodeEdgeLookup])

  // Initializing with initial items
  useEffect(() => {
    // Get the current items from the store
    const items = store.getState().items

    // If the store has not yet been initialized abort
    if (!items) return

    // If the store.items has more than 0 entries, abort
    if (items?.length > 0) return

    // Add initial items as needed
    addInitialItemsToStore({ store, initialItems })
  }, [store, initialItems])

  // Create a subscription to the store updating the window.store object
  useEffect(() => {
    if (!window.store) {
      window.store = store.getState()
      store.subscribe(s => (window.store = s))
    }
  }, [store])

  return store
}

export default useEnhancedStore
