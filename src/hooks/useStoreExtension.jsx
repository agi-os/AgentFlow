import { useEffect } from 'react'

import { useStoreApi } from '@xyflow/react'

const useStoreExtension = ({ initialItems }) => {
  const store = useStoreApi()

  useEffect(() => {
    if (store.getState().setItems) return

    store.setState(prevState => ({
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
    }))

    // Add the store to the window for debugging
    store.subscribe(
      s => (window.store = s),
      s => s
    )

    // Add the initial items to the store
    initialItems.forEach(item => store.getState().addItem(item))
  }, [store, initialItems])
}

export default useStoreExtension
