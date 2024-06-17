import createItemStore from './create'

// Map of item stores, keyed by id
const stores = new Map()

/**
 * @typedef {import('./create')} ItemStore
 */

/**
 * Get a store for a given id.
 * @param {string} id - Item ID.
 * @returns {ItemStore}
 */
const getItemStore = id => {
  // If the store doesn't exist, create it.
  if (!stores.has(id)) {
    stores.set(id, createItemStore(id))
  }

  // Return the store.
  return stores.get(id)
}

export default getItemStore
