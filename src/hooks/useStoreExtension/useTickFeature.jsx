import { useEffect } from 'react'
import { useStore, useStoreApi } from '@xyflow/react'

const useTickFeature = () => {
  // Get the handle to the store api
  const storeApi = useStoreApi()

  // Extract functions from the API
  const { getState, setState } = storeApi

  // Get the tick count from the store
  const tickCounter = useStore(s => s.tickCounter)

  // Extend the store with the tick counter value
  useEffect(() => {
    // Sanity check
    if (!setState) return

    // If tickCounter is defined, return
    if (tickCounter !== undefined) return

    // Extend the store with the tick count if it does not exist
    setState(draft => {
      return {
        ...draft,
        /**
         * Extends the store with the initial tick counter value.
         *
         * This property is used to keep track of the number of ticks that have occurred.
         * It is initialized with a value of 0, and it will be incremented by 1 on each tick.
         *
         * @type {number}
         */
        tickCounter: 0,
      }
    })
  }, [setState, tickCounter])

  // Get the map of tick callbacks from the store
  const tickCallbacks = useStore(s => s.tickCallbacks)

  // Extend the store with tick callbacks to be called on every tick
  useEffect(() => {
    // Sanity check
    if (!setState) return

    // If tickCallbacks is defined and is a Map, return
    if (tickCallbacks && tickCallbacks instanceof Map) return

    // Extend the store with the tick callbacks
    setState(draft => {
      return {
        ...draft,
        /**
         * Extends the store with a new Map for tick callbacks.
         *
         * This property is used to store functions that need to be called on every tick.
         * It is initialized as an empty Map, and functions can be added to it as needed.
         *
         * @type {Map<string, Function>}
         */
        tickCallbacks: new Map(),
      }
    })
  }, [setState, tickCallbacks])

  // Get the tick function from the store
  const tick = useStore(s => s.tick)

  // Extend the store with the tick function
  useEffect(() => {
    // Sanity check
    if (!setState || !tickCallbacks) return

    // If we already have a tick function defined, return
    if (tick && typeof tick === 'function') {
      return
    }

    // Extend the store with the tick function
    setState(draft => {
      return {
        ...draft,
        /**
         * The tick function that increments the tick counter and calls all tick callbacks.
         *
         * This function is responsible for updating the tick counter in the store by incrementing its value by 1.
         * It then retrieves all the tick callbacks from the store and executes each of them.
         *
         * @returns {void}
         */
        tick: () => {
          // Increment the tick counter
          setState(draft => {
            return {
              ...draft,
              tickCounter: draft.tickCounter + 1,
            }
          })

          // Call all of tick callbacks
          getState().tickCallbacks.forEach(callback => callback())
        },
      }
    })
  }, [getState, setState, tick, tickCallbacks])

  // Tick counter will increment every tick, tasks that are not time critical can be run on every nth tick
  useEffect(() => {
    if (tickCounter % 50 !== 0) return

    // Get the current edges from the store
    const draft = getState()

    // Generate the list of belt ids
    const newBeltIds = draft.edges
      .filter(edge => edge.type === 'queue')
      .map(edge => edge.id)

    // Compare the new list of belt ids with the old list of belt ids
    const hasChanged = newBeltIds.some(
      (id, index) => id !== draft.beltIds[index]
    )

    // If the list of belt ids has changed, update the store
    if (hasChanged) {
      setState(draft => ({
        ...draft,
        beltIds: newBeltIds,
      }))
    }
  }, [tickCounter, getState, setState])

  // Get the tick length and tick function from the store
  const tickLength = useStore(s => s.tickLength)

  // Start the tick loop
  useEffect(() => {
    // Sanity check
    if (!tick || !tickLength) return
    const tickLoop = setInterval(tick, tickLength)
    return () => clearInterval(tickLoop)
  }, [tick, tickLength])

  // Get the set tick length function
  const setTickLength = useStore(s => s.setTickLength)

  // Allow changing the tick length
  useEffect(() => {
    // Check if function is already defined
    if (setTickLength && typeof setTickLength === 'function') return

    // Update store
    setState(draft => ({
      ...draft,
      /**
       * Updates the tick length in the store based on the provided new tick length.
       * If the new tick length is not a valid number, the tick length will default to 1000.
       *
       * @param {number} newTickLength - The new tick length to be set in the store.
       * @returns {void}
       */
      setTickLength: newTickLength => {
        const parsedLength = Number(newTickLength)
        setState(draft => ({
          ...draft,
          tickLength: Number.isNaN(parsedLength) ? 1000 : parsedLength,
        }))
      },
    }))
  }, [setState, setTickLength])

  // Return the store api for testing
  return storeApi
}

export default useTickFeature
