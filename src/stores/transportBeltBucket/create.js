import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

/**
 * Represents the state of a single bucket on the transport belt.
/**
 * @typedef {import('zustand').StoreApi<TransportBeltState>} ZustandStore
 */

/**
 * Creates a Zustand store for managing the state of a transport belt bucket.
 *
 * @param {string} id - Unique identifier for the transport belt bucket.
 * @returns {ZustandStore<TransportBeltState>} - A Zustand store for managing the transport belt state.
 */
const createTransportBeltBucketStore = ({
  transportBeltIndex,
  transportBeltId,
}) =>
  // Create function from Zustand is used to create a new store.
  create(
    // Immer middleware is used to enable immutable updates to the state.
    immer((set, get) => ({
      // Initial state of the store includes the transportBeltId and transportBeltIndex.
      transportBeltId,
      transportBeltIndex,

      // Data property is an array that stores the data for the transport belt bucket.
      data: [],

      // Coordinates property is an object that stores the coordinates for the transport belt bucket.
      coordinates: {},

      // SetData function is used to update the data property of the store.
      // It takes a data argument and uses the set function from Zustand to update the state.
      setData: data =>
        set(draft => {
          draft.data = data
        }),

      // SetCoordinates function is used to update the coordinates property of the store.
      // It takes a coordinates argument and uses the set function from Zustand to update the state.
      setCoordinates: coordinates =>
        set(draft => {
          draft.coordinates = coordinates
        }),
    }))
  )

export default createTransportBeltBucketStore
