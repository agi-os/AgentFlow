import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import updatePath from './updatePath'
import getTransportBeltBucketStore from '../transportBeltBucket'

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
      pathD: '',
      pathRef: null,
      bucketSize: 38,
      bucketCapacity: 1,

      // Buckets is an array of zustand bucket stores
      buckets: [],

      // Update the buckets array
      setBuckets: buckets =>
        set(draft => {
          draft.buckets = buckets
        }),

      // Gets a bucket or creates a new one if it doesn't exist
      getBucket: index => {
        if (!get().buckets[index]) {
          set(draft => {
            draft.buckets[index] = getTransportBeltBucketStore({
              transportBeltIndex: index,
              transportBeltId: id,
            })

            if (Math.random() > 0.85) {
              draft.buckets[index]
                .getState()
                .setItemId('test' + ((Math.random() * 1000) | 0))
            }
          })
        }

        // Return the state of the bucket
        return get().buckets[index].getState()
      },

      // Tick modulo is number of ticks it takes to shift item one bucket
      tickModulo: 60,

      // Set the reference to the SVG path element
      setPathRef: pathRef =>
        set(draft => {
          draft.pathRef = pathRef
        }),

      // Set the path data string for the SVG path element
      setPathD: pathD => {
        // Ensure pathD is a string and not empty
        if (typeof pathD !== 'string' || pathD.trim() === '') {
          return
        }
        set(draft => {
          draft.pathD = pathD
        })

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
      setLength: length =>
        set(draft => {
          draft.length = length
        }),

      // Handle the tick event
      tick: tickCounter => {
        // Extract the relevant properties from state
        const { getBucket, buckets, tickModulo } = get()

        // Ignore ticks that are not multiples of tickModulo
        if (tickCounter % tickModulo !== 0) {
          return
        }

        // Move all buckets contents one bucket forwards, starting from the end and checking for capacity
        const numBuckets = buckets.length

        // Loop through the buckets in reverse order
        for (let i = numBuckets - 1; i >= 0; i--) {
          // If the current bucket is the last bucket
          if (i === numBuckets - 1) {
            // We can not move anything from the last bucket, so skip this bucket
            continue
          }

          // Get the current and next buckets
          const currBucket = getBucket(i)
          const nextBucket = getBucket(i + 1)

          // Get the current bucket contents
          const currentBucketItemId = getBucket(i).itemId

          // Get the next bucket contents
          const nextBucketItemId = getBucket(i + 1).itemId

          // If the current bucket is empty
          if (currentBucketItemId === null) {
            // We have nothing to move, so skip this bucket
            continue
          }

          // If the next bucket is occupied
          if (nextBucketItemId !== null) {
            // We are blocked from moving the item, so skip this bucket
            continue
          }

          // Compensate the item movement by calculating the negative offset needed between the old and new bucket coordinates
          const oldBucketCoordinates = currBucket.coordinates
          const newBucketCoordinates = nextBucket.coordinates
          const offset = {
            x: oldBucketCoordinates.x - newBucketCoordinates.x,
            y: oldBucketCoordinates.y - newBucketCoordinates.y,
          }

          // Move the contents from the current bucket to the next bucket
          nextBucket.setItemId(currentBucketItemId)
          currBucket.setItemId(null)

          // Get handle on the item state
          const { setCoordinates, setLocationIndex } = nextBucket
            .item()
            .getState()

          // Update the item offset coordinates to compensate for the new position
          setCoordinates(offset)

          // Update the item location
          setLocationIndex(i + 1)
        }
      },
    }))
  )

export default createTransportBeltStore
