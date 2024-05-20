import { useEffect } from 'react'
import { useStore, useStoreApi } from '@xyflow/react'
import _updateItemLocationLookup from './updateItemLocationLookup'

/**
 * Custom hook for adding item functionality to the store.
 */
const useItemLocationFeature = () => {
  // Get the handle to the store api
  const store = useStoreApi()

  // Get type of item location lookup
  const itemLocationLookupType = useStore(s => typeof s.itemLocationLookup)

  // Add the item location lookup map
  useEffect(() => {
    // Sanity check
    if (!store) return

    // If the map already exists in the store, abort
    if (itemLocationLookupType === 'object') return

    // Update the store with the new map of item locations
    store.setState(draft => ({
      ...draft,
      itemLocationLookup: new Map(),
    }))
  }, [itemLocationLookupType, store])

  // Get type of update item location lookup function
  const updateItemLocationLookupType = useStore(
    s => typeof s.updateItemLocationLookup
  )

  // Add update item location lookup functionality
  useEffect(() => {
    // Sanity check
    if (!store) return

    // If the function already exists in the store, abort
    if (updateItemLocationLookupType === 'function') return

    // Update the store with the new function
    store.setState(draft => ({
      ...draft,
      updateItemLocationLookup: () => _updateItemLocationLookup(store),
    }))
  }, [store, updateItemLocationLookupType])
}

export default useItemLocationFeature
