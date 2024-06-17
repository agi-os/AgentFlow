import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

/**
 * Represents the state of a item.
 * @typedef {Object} ItemState
 * @property {string} id - The unique identifier for the item.
 */

/**
 * @typedef {import('zustand').StoreApi<ItemState>} ZustandStore
 */

/**
 * Creates a Zustand store for managing the state of a item.
 *
 * @param {string} id - The unique identifier for the item.
 * @returns {ZustandStore<ItemState>} - A Zustand store for managing the item state.
 */
const createItemStore = id =>
  create(
    immer((set, get) => ({
      id,
      type: 'item',
      emoji: '📦',
      coordinates: { x: 0, y: 0 },

      // Location of the item
      location: {
        id: null,
        type: 'inventory',
        index: 0,
      },

      // Set the location of the item
      setLocation: location =>
        set(draft => {
          draft.location = location
        }),

      // Set the location index of the item
      setLocationIndex: index =>
        set(draft => {
          draft.location.index = index
        }),

      // Set the type
      setType: type =>
        set(draft => {
          draft.type = type
        }),

      // Set the emoji
      setEmoji: emoji =>
        set(draft => {
          draft.emoji = emoji
        }),

      setCoordinates: coordinates => {
        // Get existing coordinates
        const { x, y } = get().coordinates

        // Sanity check, are new coordinates different from the old ones?
        if (coordinates.x === x && coordinates.y === y) {
          return
        }

        // Update coordinates
        set(draft => {
          draft.coordinates = coordinates
        })

        // Reset coordinates after short delay
        setTimeout(() => {
          get().setCoordinates({ x: 0, y: 0 })
        }, 100)
      },
    }))
  )

export default createItemStore
