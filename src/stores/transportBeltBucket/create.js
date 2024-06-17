import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import getItemStore from '../item'

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

      // Item id is the unique identifier for the item stored in the bucket.
      itemId: null,

      // Item returns the reference to the item store.
      item: () => {
        const { itemId } = get()
        return itemId ? getItemStore(itemId) : null
      },

      // Coordinates property is an object that stores the coordinates for the transport belt bucket.
      coordinates: {},

      // SetItem updates the item property of the store.
      setItemId: itemId =>
        set(draft => {
          draft.itemId = itemId
        }),

      // SetCoordinates updates the coordinates property of the store.
      setCoordinates: coordinates =>
        set(draft => {
          draft.coordinates = coordinates
        }),
    }))
  )

export default createTransportBeltBucketStore
