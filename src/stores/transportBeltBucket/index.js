import createTransportBeltBucketStore from './create'

// Map of bucket stores, keyed by id
const stores = new Map()

/**
 * @typedef {import('./create')} TransportBeltBucketStore
 */

/**
 * Get a store for a given set of props.
 * @param {Object} props - The props to use for the store.
 * @returns {TransportBeltBucketStore}
 */
const getTransportBeltBucketStore = props => {
  // Create a key from the props.
  const key = JSON.stringify(props)

  // If the store doesn't exist, create it.
  if (!stores.has(key)) {
    stores.set(key, createTransportBeltBucketStore(props))
  }

  // Return the store.
  return stores.get(key)
}

export default getTransportBeltBucketStore
