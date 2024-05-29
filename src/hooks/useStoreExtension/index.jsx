// File: ./hooks/useStoreExtension/index.jsx
import {
  INITIAL_SPEED,
  TICKS_PER_SECOND,
} from '../../constants/_mainConfiguration'

import { useEffect } from 'react'

import generateId from './generateId'
import { useStore, useStoreApi } from '@xyflow/react'
import debounce from './debounce'

import lookup from './lookup'
import useTickFeature from './useTickFeature'
import useBeltDriveFeature from './useBeltDriveFeature'
import useSocketFeature from './useSocketFeature'
import useSignalFeature from './useSignalFeature'
import useSignalHubFeature from './useSignalHubFeature'
import useNodeEdgesFeature from './useNodeEdgesFeature'
import useDatabaseFeature from './useDatabaseFeature/index'
import useSkillFeature from './useSkillFeature'
import useItemManagementFeature from './useItemManagementFeature'
import useItemFeature from './useItemFeature'

/**
 * Custom hook that enhances the store with additional functionality.đ
 * @returns {Object} - The enhanced store object.
 */
const useEnhancedStore = () => {
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

      // updateItemLookup: () => _updateItemLookup(store),

      updateNodeData: (nodeId, dataUpdate) => {
        store.setState(state => ({
          nodes: state.nodes.map(node =>
            node.id === nodeId
              ? { ...node, data: { ...node.data, ...dataUpdate } }
              : node
          ),
        }))
      },

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
  useItemManagementFeature()

  // Extend store with belt drive functionality
  useBeltDriveFeature()

  // Extend store with socket.io functionality
  useSocketFeature()

  // Extend store with signal functionality
  useSignalFeature()

  // Extend store with signal hub functionality
  useSignalHubFeature()

  // Extend store with database functionality
  useDatabaseFeature()

  // Extend store with level functionality
  useSkillFeature()

  // Extend store with legacy item functionality
  useItemFeature()

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

  return store
}

export default useEnhancedStore
