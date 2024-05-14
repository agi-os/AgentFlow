import { useEffect } from 'react'
import { useStoreApi } from '@xyflow/react'

/**
 * Custom hook for managing store extension.
 *
 * @param {Object} options - The options for the store extension.
 * @param {Array} options.initialItems - The initial items to add to the store.
 */
const useStoreExtension = ({ initialItems }) => {
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

      // Extend the store
      return {
        // Keep the previous state
        ...prevState,

        // Array of items
        items: [],

        // Map of items by id
        itemLookup: new Map(),

        // Add an item to the store
        addItem: item => {
          // If item does not have an id
          if (!item.id) {
            // Check if there are no items in the store with the same content
            const existingItem = store.getState().items.find(existingItem => {
              // Stringify skipping the id
              const existingItemString = JSON.stringify(
                existingItem,
                (key, value) => (key === 'id' ? undefined : value)
              )
              const itemString = JSON.stringify(item)
              return existingItemString === itemString
            })

            // If there is an item with the same values, abort
            if (existingItem) return

            // Generate a random id
            item.id = window?.crypto?.randomUUID()?.slice(-4) || Math.random()
          }

          // If item is already in the store, do not add it again
          if (store.getState().itemLookup?.has(String(item.id))) return

          // Save changes to the store
          store.setState(prevState => ({
            ...prevState,
            items: [...prevState.items, item],
            itemLookup: new Map([
              ...prevState.itemLookup,
              [String(item.id), item],
            ]),
          }))
        },

        // Get an item by its id
        getItem: id => store.getState().itemLookup.get(String(id)),
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
    initialItems.forEach(item => store.getState().addItem(item))
  }, [store, initialItems])
}

export default useStoreExtension
