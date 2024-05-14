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

        // Move an item from a node to an edge
        moveItemFromNodeToEdge: (itemId, nodeId, edgeId) =>
          moveItemFromNodeToEdge({ store, itemId, nodeId, edgeId }),

        // Move an item from an edge to a node
        moveItemFromEdgeToNode: (itemId, edgeId, nodeId) =>
          moveItemFromEdgeToNode({ store, itemId, edgeId, nodeId }),
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
  // Generate an array of random bytes
  const randomArray = new Uint8Array(Math.ceil((length * Math.log2(34)) / 8))

  // Fill the array with random values
  window.crypto.getRandomValues(randomArray)
  // Define the replacements for characters
  const replacements = {
    o: '0',
    i: '1',
    l: '1',
    s: '5',
    b: '6',
    t: '7',
    z: '2',
  }

  // Create a regular expression to match the characters to be replaced
  const regex = new RegExp(Object.keys(replacements).join('|'), 'gi')

  const id = Array.from(randomArray)
    // Convert each byte in the random array to a hexadecimal string
    .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '')
    // Convert the concatenated hexadecimal string to a base-36 string
    .toString(36)
    // Convert the ID to lowercase
    .toLowerCase()
    // Replace the characters with their replacements
    .replace(regex, matched => replacements[matched])
    // Trim the ID to the desired length
    .slice(-length)
    // Add a dash after every 3 characters
    .replace(/(.{3})(?=.)/g, '$1-')

  // Return the generated ID
  return id
}

/**
 * Move an item from one entity to another.
 * @param {Object} store - The store object.
 * @param {string} itemId - The ID of the item to move.
 * @param {string} fromId - The ID of the entity to move the item from.
 * @param {string} toId - The ID of the entity to move the item to.
 * @param {string} fromType - The type of the entity to move the item from (node or edge).
 * @param {string} toType - The type of the entity to move the item to (node or edge).
 * @returns {boolean} True if the item was moved successfully, false otherwise.
 */
const moveItem = (store, itemId, fromId, toId, fromType, toType) => {
  // If the item does not exist, return false
  if (!store.getState().getItem(itemId)) return false

  // Get the entities from the store
  const fromEntity = store.getState()[`${fromType}Lookup`].get(fromId)
  const toEntity = store.getState()[`${toType}Lookup`].get(toId)

  // If either entity does not exist, return false
  if (!fromEntity || !toEntity) return false

  // If the fromEntity does not have the item, return false
  if (!fromEntity.data.items.includes(itemId)) return false

  // If the toEntity already has the item, return false
  if (toEntity.data.items.includes(itemId)) return false

  // Remove the item from the fromEntity
  const newFromEntityData = {
    ...fromEntity.data,
    items: fromEntity.data.items.filter(i => i !== itemId),
  }

  // Add the item to the toEntity
  const newToEntityData = {
    ...toEntity.data,
    items: [...toEntity.data.items, itemId],
  }

  // Update the entities with the new item lists
  store.setState(prevState => ({
    ...prevState,
    [fromType + 's']: prevState[fromType + 's'].map(e =>
      e.id === fromId ? { ...e, data: newFromEntityData } : e
    ),
    [toType + 's']: prevState[toType + 's'].map(e =>
      e.id === toId ? { ...e, data: newToEntityData } : e
    ),
  }))

  return true
}

/**
 * Move an item from a node to an edge.
 * @param {Object} store - The store object.
 * @param {string} itemId - The ID of the item to move.
 * @param {string} nodeId - The ID of the node to move the item from.
 * @param {string} edgeId - The ID of the edge to move the item to.
 * @returns {boolean} True if the item was moved successfully, false otherwise.
 */
const moveItemFromNodeToEdge = ({ store, itemId, nodeId, edgeId }) =>
  moveItem(store, itemId, nodeId, edgeId, 'node', 'edge')

/**
 * Move an item from an edge to a node.
 * @param {Object} store - The store object.
 * @param {string} itemId - The ID of the item to move.
 * @param {string} edgeId - The ID of the edge to move the item from.
 * @param {string} nodeId - The ID of the node to move the item to.
 * @returns {boolean} True if the item was moved successfully, false otherwise.
 */
const moveItemFromEdgeToNode = ({ store, itemId, edgeId, nodeId }) =>
  moveItem(store, itemId, edgeId, nodeId, 'edge', 'node')

/**
 * Retrieves an item from the store based on the provided ID.
 *
 * @param {Object} store - The store object.
 * @param {string} id - The ID of the item to retrieve.
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
