import { useStoreApi } from '@xyflow/react'
import getTransportBeltStore from '../stores/transportBelt'

/**
 * A custom hook that provides access to the state of a transport belt store.
 *
 * @param {string} id - The unique identifier for the transport belt.
 * @returns {Object} - The current state of the transport belt store.
 */
const useTransportBeltStore = id => {
  // Get the main store to hook into the tick event
  const storeApi = useStoreApi()

  // Get the store for the given id
  const store = getTransportBeltStore(id, storeApi)

  // Get the current state of the store
  const state = store.getState()

  // Return the current state of the store
  return state
}

export default useTransportBeltStore
