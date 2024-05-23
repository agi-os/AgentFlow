import { INITIAL_SPEED, TICKS_PER_SECOND } from '../../constants/_mainConfig'

import { useEffect } from 'react'

import generateId from './generateId'
import addInitialItemsToStore from './addInitialItemsToStore'
import { useStore, useStoreApi } from '@xyflow/react'
import debounce from './debounce'

import _updateItemLookup from './updateItemLookup'
import _getLocationItems from './getLocationItems'
import getLocationItemsSorted from './getLocationItemsSorted'
import lookup from './lookup'
import useTickFeature from './useTickFeature'
import useBeltDriveFeature from './useBeltDriveFeature'
import useItemFeature from './useItemFeature'
import useSocketFeature from './useSocketFeature'
import useSignalFeature from './useSignalFeature'
import useSignalHubFeature from './useSignalHubFeature'
import useNodeEdgesFeature from './useNodeEdgesFeature'
import { loadFromIndexedDB, saveToIndexedDB } from './useDatabase'
// Function to save specific parts of the store state to localStorage under separate keys
const saveToLocalStorage = debounce(
  'saveToLocalStorage',
  (key, value) => {
    try {
      JSON.parse(value)
      localStorage.setItem(key, value)
      console.log('writing', key, JSON.parse(value))
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  },
  250
) // Debounce with a 1/4-second delay

/**
 * Custom hook that enhances the store with additional functionality.
 * @param {Object} options - The options for the enhanced store.
 * @param {Array} options.initialItems - The initial items to add to the store.
 * @returns {Object} - The enhanced store object.
 */
const useEnhancedStore = ({ initialItems }) => {
  const store = useStoreApi()

  // Get the reference to items initialized in first useEffect
  const tickLength = useStore(s => s.tickLength)
  const speed = useStore(s => s.speed)

  // Extend the store with custom methods
  useEffect(() => {
    // Sanity check
    if (!store) return

    // If values are already defined, return
    if (tickLength && speed) return

    // Initialize the store with the new methods
    store.setState(draft => ({
      ...draft,

      // Tick length in ms, this is base unit of all operations, 16.666ms = 60fps
      tickLength: (1000 / TICKS_PER_SECOND) | 0,

      // System wide average speed of movement of the belt items
      speed: INITIAL_SPEED | 0,

      // System wide random variance of the individual item movements
      speedJitter: 0.25,

      // Update the speed of all belts
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

      updateItemLookup: () => _updateItemLookup(store),

      removeItem: id => {
        store.getState().setItemLocation({ itemId: id, locationId: null })
        store.getState().itemLookup.delete(id)
        store.setState(draft => ({
          ...draft,
          items: draft.items.filter(item => item.id !== id),
        }))
        store.getState().updateItemLookup()
        store.getState().updateItemLocationLookup()
      },

      getLocationItems: locationId => _getLocationItems({ store, locationId }),
      getLocationItemsSorted: locationId =>
        getLocationItemsSorted({ store, locationId }),

      generateId,
      getNode: id => store.getState().nodeLookup.get(id),
      getEdge: id => store.getState().edgeLookup.get(id),
      lookup: id => lookup({ store, id }),
    }))
  }, [store, tickLength, speed])

  // Extend store with node edge functionality
  useNodeEdgesFeature()

  // Extend store with tick functionality
  useTickFeature()

  // Extend store with item functionality
  useItemFeature()

  // Extend store with belt drive functionality
  useBeltDriveFeature()

  // Extend store with socket.io functionality
  useSocketFeature()

  // Extend store with signal functionality
  useSignalFeature()

  // Extend store with signal hub functionality
  useSignalHubFeature()

  // Get the current tick
  const tickCounter = useStore(s => s.tickCounter)
  const updateNodeEdgeLookup = useStore(s => s.updateNodeEdgeLookup)

  // Update node edges on every 50th tick
  useEffect(() => {
    if (tickCounter % 50 !== 0) return
    updateNodeEdgeLookup()
  }, [tickCounter, updateNodeEdgeLookup])

  // Create a subscription to the store updating the window.store object
  useEffect(() => {
    if (!window.store) {
      window.store = store.getState()
      store.subscribe(s => (window.store = s))
    }
  }, [store])

  // Add autosave functionality
  useEffect(() => {
    const nodeExcludeKeys = new Set([
      'location',
      'selected',
      'dragging',
      'measured',
    ])

    const nodeFilter = (key, value) => {
      if (nodeExcludeKeys.has(key)) return undefined
      if (key === 'position') {
        value.x = Math.floor(value.x)
        value.y = Math.floor(value.y)
      }
      return value
    }

    const edgeExcludeKeys = new Set(['length', 'selected'])

    const edgeFilter = (key, value) => {
      if (edgeExcludeKeys.has(key)) return undefined
      return value
    }

    // Cache of last writes as JSON
    const writeCache = {
      nodes: '',
      edges: '',
    }

    // Subscribe to store changes and trigger saveToLocalStorage when change is detected
    const unsubscribe = store.subscribe(() => {
      const currentState = store.getState()
      const currentNodesJSON = JSON.stringify(currentState.nodes, nodeFilter)
      const currentEdgesJSON = JSON.stringify(currentState.edges, edgeFilter)

      if (currentNodesJSON !== writeCache.nodes) {
        saveToLocalStorage('nodes', currentNodesJSON)
        writeCache.nodes = currentNodesJSON
      }

      if (currentEdgesJSON !== writeCache.edges) {
        saveToLocalStorage('edges', currentEdgesJSON)
        writeCache.edges = currentEdgesJSON
      }
    })

    // Cleanup function to unsubscribe on unmount
    return unsubscribe
  }, [store])

  // // Save the nodes and edges to IndexedDB
  // useEffect(() => {
  //   // IndexedDB setup
  //   loadFromIndexedDB(store)

  //   // Subscribe to store changes and save to IndexedDB
  //   const unsubscribe = store.subscribe(() => {
  //     saveToIndexedDB(store)
  //   })

  //   return unsubscribe
  // }, [store])

  return store
}

export default useEnhancedStore
