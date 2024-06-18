import createSplitterStore from './create'

// Map of belt stores, keyed by id
const stores = new Map()

/**
 * @typedef {import('./create')} SplitterStore
 */

/**
 * Get a store for a given id.
 * @param {string} id - Edge ID.
 * @param {Object} storeApi - The main store API.
 * @returns {SplitterStore}
 */
const getSplitterStore = (id, storeApi) => {
  // If the store doesn't exist, create it.
  if (!stores.has(id)) {
    console.log('Creating splitter store for', id)
    stores.set(id, createSplitterStore(id))

    // Get the handle to the tick event of the new store.
    const tick = stores.get(id).getState().tick

    // Subscribe to the global tick event
    storeApi.getState().tickCallbacks.set(id, tick)
  }

  // Return the store.
  return stores.get(id)
}

export default getSplitterStore
