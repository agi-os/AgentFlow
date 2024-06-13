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
      bucketContents: [],
      pathD: '',
      pathRef: null,
      bucketSize: 38,
      bucketCapacity: 1,

      // Tick modulo is number of ticks it takes to shift item one bucket
      tickModulo: 60,

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
        // Ignore ticks that are not multiples of tickModulo
        if (tickCounter % get().tickModulo !== 0) {
          return
        }

        // Get the current state
        const state = get()

        // Extract the relevant properties
        let { bucketCenters, bucketContents, bucketCapacity } = state

        // Sanity check
        if (!bucketCenters || !bucketContents) {
          return
        }

        // Move all buckets contents one bucket forwards, starting from the end and checking for capacity
        const numBuckets = bucketCenters.length

        // If bucketContents is not initialized, initialize it
        if (bucketContents.length !== numBuckets) {
          // Initialize bucketContents with empty arrays for each bucket
          bucketContents = Array.from({ length: numBuckets }, () => [])

          bucketContents[2].push('test')

          console.log('Initializing bucketContents', bucketContents)

          // Updating the state with the new bucketContents
          set({ bucketContents })
        }

        console.log('Ticking', tickCounter, numBuckets)

        // Loop through the buckets in reverse order
        for (let i = numBuckets - 1; i >= 0; i--) {
          // If the current bucket is the last bucket, skip it
          if (i === numBuckets - 1) {
            console.log('This bucket is last, skipping', i)
            continue
          }

          // Get the current bucket contents
          const currentBucketContents = bucketContents[i]

          // If the current bucket is empty, skip it
          if (currentBucketContents.length === 0) {
            console.log('This bucket is empty, skipping', i)
            continue
          }

          // If the next bucket is full, we can'd work on this bucket
          if (bucketContents[i + 1].length >= bucketCapacity) {
            console.log('Next bucket is full, skipping this bucket', i)
            continue
          }

          // Move the first item from the current bucket to the next bucket
          const item = currentBucketContents.shift()
          bucketContents[i + 1].push(item)

          console.table(bucketContents)

          // Update the state with the new bucketContents
          set({ bucketContents })
        }
      },
    }))
  )

export default createTransportBeltStore
