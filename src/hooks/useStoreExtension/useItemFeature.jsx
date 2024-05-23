import { useEffect } from 'react'
import { useStore, useStoreApi } from '@xyflow/react'
import _setItem from './setItem'
import useItemLocationFeature from './useItemLocationFeature'

/**
 * Custom hook for adding item functionality to the store.
 */
const useItemFeature = () => {
  // Get the handle to the store api
  const store = useStoreApi()

  // Get information about the items in the store
  const itemsIsArray = useStore(s => Array.isArray(s.items))
  const itemLookupIsMap = useStore(s => s.itemLookup instanceof Map)

  // Add the baseline item stores
  useEffect(() => {
    // Sanity check
    if (!store) return

    // If the store is already set up with items, abort
    if (itemsIsArray && itemLookupIsMap) return

    // Update the store with the new item functionality
    store.setState(draft => ({
      ...draft,
      items: [],
      itemLookup: new Map(),
    }))
  }, [store, itemsIsArray, itemLookupIsMap])

  // Get the handle to the item setter
  const setItem = useStore(s => s.setItem)

  // Add the item setter functionality
  useEffect(() => {
    // Sanity check
    if (!store) return

    // If the store is already set up with item setter, abort
    if (typeof setItem === 'function') return

    // Update the store with the new item functionality
    store.setState(draft => ({
      ...draft,
      setItem: item => _setItem({ store, item }),
    }))
  }, [setItem, store])

  // Get the handle to the item getter
  const getItem = useStore(s => s.getItem)

  // Add the get item functionality
  useEffect(() => {
    // Sanity check
    if (!store) return

    // If the store is already set up with item getter, abort
    if (typeof getItem === 'function') return

    // Update the store with the new item functionality
    store.setState(draft => ({
      ...draft,
      getItem: id => store.getState().itemLookup.get(id),
    }))
  }, [store, getItem])

  // Get the handle to the item location setter
  const setItemLocation = useStore(s => s.setItemLocation)

  // Add the item location change at 0 distance functionality
  useEffect(() => {
    // Sanity check
    if (!store || !getItem || !setItem) return

    // If function already exists in the store, abort
    if (typeof setItemLocation === 'function') return

    // Update the store with the new function
    store.setState(draft => ({
      ...draft,
      setItemLocation: ({ itemId, locationId }) => {
        // Get the item
        const item = getItem(itemId)

        // If the item does not exist, abort
        if (!item) return

        // Update the item's location and delivery time
        item.location = {
          id: locationId,
          distance: 0,
          deliveryTime: new Date().getTime(),
        }

        // Update the store with the new item
        setItem(item)
      },
    }))
  }, [getItem, store, setItem, setItemLocation])

  // Get handle to the item location distance setter
  const setItemDistance = useStore(s => s.setItemDistance)

  // Add the item distance traveled setter functionality
  useEffect(() => {
    // Sanity check
    if (!store || !getItem || !setItem) return

    // If function already exists in the store, abort
    if (typeof setItemDistance === 'function') return

    // Update the store with the new function
    store.setState(draft => ({
      ...draft,
      setItemDistance: ({ itemId, distance }) => {
        // Get the item
        const item = getItem(itemId)

        // If the item does not exist, abort
        if (!item) return

        // If the item does not have a location
        if (!item.location) {
          // Create a new location for the item
          item.location = {
            id: 'unknown',
            distance,
          }
          console.warn(
            `Item ${itemId} has no location. Setting location to 'unknown'.`
          )
        } else {
          // Update the item's location
          item.location.distance = distance
        }

        // Update the store with the new item
        setItem(item)
      },
    }))
  }, [getItem, store, setItem, setItemDistance])

  // Add extra item features
  useItemLocationFeature()
}

export default useItemFeature
