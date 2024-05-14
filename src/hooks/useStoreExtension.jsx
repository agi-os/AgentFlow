import { useEffect } from 'react'
import { useStoreApi } from '@xyflow/react'

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
        getItem: id => getItemFromStore(store, id),

        // Generate an unique ID
        generateId,
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

/**
 * Generates an unique ID, default length of 6 is highly probable to be unique for over 10_000 generated IDs.
 * @param {number} [length=6] - Optional length of the generated ID.
 * @returns {string} The generated ID.
 */

const generateId = (length = 6) => {
  const randomArray = new Uint8Array(Math.ceil((length * Math.log2(34)) / 8))
  window.crypto.getRandomValues(randomArray)
  const id = Array.from(randomArray)
    .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '')
    .toString(36)
    .toUpperCase()
    .replaceAll('O', '0')
    .replaceAll('I', '1')
    .slice(-length)
  return id
}

/**
 * Retrieves an item from the store based on the provided ID.
 *
 * @param {Object} store - The store object.
 * @param {number} id - The ID of the item to retrieve.
 * @returns {any} The item from the store.
 */
const getItemFromStore = (store, id) =>
  store.getState().itemLookup.get(String(id))

/**
 * Adds an item to the store.
 *
 * @param {Object} store - The store object.
 * @param {Object} item - The item to add to the store.
 */
const addItemToStore = (store, item) => {
  // Get a handle to the store state
  const state = store.getState()

  // If item does not have an id
  if (!item.id) {
    // Check if there are no items in the store with the same content
    const existingItem = state.items.find(existingItem => {
      // Stringify items without the id property
      const existingItemString = JSON.stringify(existingItem, (key, value) =>
        key === 'id' ? undefined : value
      )
      // Compare the stringified content
      return existingItemString === JSON.stringify(item)
    })

    // If there is an item with the same values, skip adding it to the store
    if (existingItem) return

    // Generate a random id for the item without an id
    item.id = state.generateId()
  }

  // If the item is already in the store, do not add it again
  if (state.getItem(item.id)) return

  // Save changes to the store
  store.setState(prevState => ({
    ...prevState,
    items: [...prevState.items, item],
    itemLookup: new Map([...prevState.itemLookup, [String(item.id), item]]),
  }))
}

/**
 * Adds initial items to the store.
 *
 * @param {Object} store - The store object.
 * @param {Array} initialItems - The array of initial items to be added.
 */
const addInitialItemsToStore = (store, initialItems) => {
  // Sanity check
  if (!initialItems || !Array.isArray(initialItems)) return

  // Get a handle to the add item function
  const addItem = store.getState().addItem

  // Loop through the initial items and add them to the store
  initialItems.forEach(item => addItem(item))
}

export default useStoreExtension
