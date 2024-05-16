import { useEffect } from 'react'

import generateId from './generateId'
import addInitialItemsToStore from './addInitialItemsToStore'
import { useStoreApi } from '@xyflow/react'
import debounce from './debounce'

import addItem from './addItem'
import updateItemLocationLookup from './updateItemLocationLookup'
import updateItemLookup from './updateItemLookup'
import getLocationItems from './getLocationItems'
import getLocationItemsSorted from './getLocationItemsSorted'
import lookup from './lookup'

/**
 * Custom hook that enhances the store with additional functionality.
 * @param {Object} options - The options for the enhanced store.
 * @param {Array} options.initialItems - The initial items to add to the store.
 * @returns {Object} - The enhanced store object.
 */
const useEnhancedStore = ({ initialItems }) => {
  const store = useStoreApi()

  useEffect(() => {
    // If the store has been extended previously, abort
    if (store.getState().generateId) return

    // Initialize the store with the new methods
    store.setState(draft => ({
      ...draft,

      items: [],
      addItem: item => addItem({ store, item }),
      setItem: item => addItem({ store, item }),

      itemLookup: new Map(),
      updateItemLookup: debounce(() => updateItemLookup(store)),
      getItem: id => store.getState().itemLookup.get(id),

      itemLocationLookup: new Map(),
      updateItemLocationLookup: debounce(() => updateItemLocationLookup(store)),
      getLocationItems: locationId => getLocationItems({ store, locationId }),
      getLocationItemsSorted: locationId =>
        getLocationItemsSorted({ store, locationId }),

      generateId,
      getNode: id => store.getState().nodeLookup.get(id),
      getEdge: id => store.getState().edgeLookup.get(id),
      lookup: id => lookup({ store, id }),
    }))
  }, [store])

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
