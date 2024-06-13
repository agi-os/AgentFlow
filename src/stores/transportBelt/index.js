import createTransportBeltStore from './createTransportBeltStore'

// Map of stores, keyed by id
const stores = new Map()

/**
 * @typedef {import('./createTransportBeltStore')} TransportBeltStore
 */

/**
 * Get a store for a given id.
 * @param {string} id - Edge ID.
 * @param {Object} storeApi - The main store API.
 * @returns {TransportBeltStore}
 */
const getTransportBeltStore = (id, storeApi) => {
  // If the store doesn't exist, create it.
  if (!stores.has(id)) {
    stores.set(id, createTransportBeltStore(id))

    // Get the handle to the tick event of the new store.
    const tick = stores.get(id).getState().tick

    // Subscribe to the global tick event
    storeApi.getState().tickCallbacks.set(id, tick)
  }

  // Return the store.
  return stores.get(id)
}

export default getTransportBeltStore
