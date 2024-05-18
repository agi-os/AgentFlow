import { useEffect } from 'react'
import { useStore, useStoreApi } from '@xyflow/react'

const useTickFeature = () => {
  // Get the handle to the store api
  const { getState, setState } = useStoreApi()

  // Get the tick counter from the store
  const tickCounter = useStore(s => s.tickCounter)

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
  const tick = useStore(s => s.tick)

  // Start the tick loop
  useEffect(() => {
    // Sanity check
    if (!tick || !tickLength) return
    const tickLoop = setInterval(tick, tickLength)
    return () => clearInterval(tickLoop)
  }, [tick, tickLength])
}

export default useTickFeature
