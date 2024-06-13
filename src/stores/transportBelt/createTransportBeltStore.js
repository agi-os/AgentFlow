import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import updatePath from './updatePath'

/**
 * Represents the state of a transport belt.
 * @typedef {Object} TransportBeltState
 * @property {string} id - The unique identifier for the transport belt.
 * @property {number} length - The length of the transport belt.
 * @property {Array<number>} bucketCenters - The centers of the buckets on the transport belt.
 * @property {string} pathD - The path data string for the SVG path element.
 * @property {SVGPathElement | null} pathRef - The reference to the SVG path element.
 * @property {number} bucketSize - The size in px length of each bucket on the transport belt.
 * @property {number} bucketCapacity - The capacity of each bucket on the transport belt.
 * @property {Function} setPathRef - A function to set the reference to the SVG path element.
 * @property {Function} setPathD - A function to set the path data string for the SVG path element.
 * @property {Function} updatePath - A function to update the path data string for the SVG path element.
 * @property {Function} setLength - A function to set the length of the transport belt.
 * @property {Function} setBucketCenters - A function to set the centers of the buckets on the transport belt.
 * @property {Function} tick - A function to simulate the movement of the transport belt.
 */

/**
 * @typedef {import('zustand').StoreApi<TransportBeltState>} ZustandStore
 */

/**
 * Creates a Zustand store for managing the state of a transport belt.
 *
 * @param {string} id - The unique identifier for the transport belt.
 * @returns {ZustandStore<TransportBeltState>} - A Zustand store for managing the transport belt state.
 */
const createTransportBeltStore = id =>
  create(
    immer((set, get) => ({
      id,
      length: -1,
      bucketCenters: [],
      pathD: '',
      pathRef: null,
      bucketSize: 38,
      bucketCapacity: 1,

      // Set the reference to the SVG path element
      setPathRef: pathRef => set({ pathRef }),

      // Set the path data string for the SVG path element
      setPathD: pathD => {
        // Ensure pathD is a string and not empty
        if (typeof pathD !== 'string' || pathD.trim() === '') {
          return
        }
        set({ pathD })

        // Get the references
        const { pathRef, updatePath } = get()

        // Ensure pathRef is not null
        if (!pathRef) {
          return
        }

        // Update the path attribute of the SVG path element
        pathRef.setAttribute('d', pathD)

        // Update the path
        updatePath()
      },

      // Updates the path based on the current state of the store
      updatePath: () => updatePath(id),

      // Set the length of the path
      setLength: length => set({ length }),

      // Set the array of bucket centers
      setBucketCenters: bucketCenters => set({ bucketCenters }),

      // Handle the tick event
      tick: tickCounter => {
        console.log('tick', tickCounter)
      },
    }))
  )

export default createTransportBeltStore
