import { useEffect } from 'react'
import { useStore, useStoreApi } from '@xyflow/react'

const useBeltDriveFeature = () => {
  // Get the handle to the store api
  const { getState, setState } = useStoreApi()

  // Get the belt drive function from the store
  const beltDrive = useStore(s => s.beltDrive)

  // Extend the store with the tick functionality
  useEffect(() => {
    // Sanity check
    if (!setState || !beltDrive) return

    // Extend the store with the tick count if it does not exist
    setState(draft => {
      return {
        ...draft,
        tickCounter: 0,
      }
    })

    // Extend the store with the tick function
    setState(draft => {
      return {
        ...draft,
        tick: () => {
          // Increment the tick counter
          setState(draft => {
            return {
              ...draft,
              tickCounter: draft.tickCounter + 1,
            }
          })

          // Call the belt drive function
          beltDrive()
        },
      }
    })
  }, [setState, beltDrive])

  // Get the speed, belt ids and getLocationItems function from the store
  const speed = useStore(s => s.speed)
  const beltIds = useStore(s => s.beltIds)
  const getLocationItems = useStore(s => s.getLocationItems)

  // Extend the store with the belt drive functionality
  useEffect(() => {
    // Sanity check
    if (!speed || !beltIds || !getLocationItems) return

    // Extend the store with the belt drive function
    setState(draft => {
      return {
        ...draft,
        // Belt drive called every tick to move items on the belt one step
        beltDrive: () => {
          // Get the distance change per tick
          const delta = speed / 100000

          // Get all items on all belts in flat array
          const items = beltIds.reduce((acc, id) => {
            const items = getLocationItems(id)
            return acc.concat(items)
          }, [])

          // Get all items with a distance more than 0
          const itemsToMove = items.filter(item => item?.location?.distance > 0)

          // Move all items on all belts which can be moved
          itemsToMove.forEach(item => {
            // Update the item's location
            getState().setItem({
              ...item,
              location: {
                ...item?.location,
                distance: item?.location?.distance - delta,
              },
            })
          })
        },
      }
    })
  }, [speed, beltIds, getLocationItems, setState, getState])
}

export default useBeltDriveFeature
