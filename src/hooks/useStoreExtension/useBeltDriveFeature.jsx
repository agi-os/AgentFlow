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

  // Get handles to variables and functions from the store
  const speed = useStore(s => s.speed)
  const speedJitter = useStore(s => s.speedJitter)
  const beltIds = useStore(s => s.beltIds)
  const getLocationItems = useStore(s => s.getLocationItems)
  const setItem = useStore(s => s.setItem)
  const getEdge = useStore(s => s.getEdge)
  const getNode = useStore(s => s.getNode)
  const getItem = useStore(s => s.getItem)

  // Extend the store with the belt drive functionality
  useEffect(() => {
    // Sanity check
    if (
      !speed ||
      !beltIds ||
      !getLocationItems ||
      !setItem ||
      !getEdge ||
      !getNode
    )
      return

    // Extend the store with the belt drive function
    setState(draft => {
      return {
        ...draft,
        // Belt drive called every tick to move items on the belt one step
        beltDrive: () => {
          // Get all items on all belts in flat array
          const items = beltIds.reduce((acc, id) => {
            const items = getLocationItems(id)
            return acc.concat(items)
          }, [])

          // Separate items on the belt into two arrays
          let itemsToMove = []
          let itemsAtDestination = []

          items.forEach(item => {
            if (item?.location?.distance < 1) {
              itemsToMove.push(item)
            } else if (item?.location?.distance >= 1) {
              itemsAtDestination.push(item)
            }
          })

          // Move all items which can be moved
          itemsToMove.forEach(item => {
            // Get the belt
            const belt = getEdge(item?.location?.id)

            // Sanity check
            if (!belt) return

            // Get the length of the belt
            const beltLength = getEdge(item?.location?.id)?.length

            // Sanity check
            if (!beltLength) return

            // Get the location on the belt at the current distance traveled in %
            const currentLocation = item?.location?.distance * beltLength

            // Apply a random jitter to the speed
            const jitterAmount = speed * speedJitter * (Math.random() - 0.5)

            // Get the speed with jitter
            const speedWithJitter = speed + jitterAmount

            // Get the new location on the belt after traveling at speed for one tick
            const newLocation = currentLocation + speedWithJitter / 100

            // Get the new distance the item will be at after traveling at speed for one tick
            const distance = newLocation / beltLength

            // Update the item's distance traveled
            setItem({
              ...item,
              location: {
                ...item?.location,
                distance,
              },
            })
          })

          // Put all items that have reached the destination into the destination if type is 'itemChest'
          itemsAtDestination.forEach(item => {
            // Get the destination from the belt item is on
            const belt = getEdge(item?.location?.id)

            // Get the destination from the belt
            const destination = getNode(belt?.target)

            // Get the type of the destination
            const destinationType = destination?.type

            // Put the item on the belt if the destination is an item chest
            if (destinationType === 'itemChest') {
              setItem({
                ...item,
                location: {
                  id: destination?.id,
                  distance: 0,
                },
              })
            }
          })
        },
      }
    })
  }, [
    speed,
    beltIds,
    getLocationItems,
    setState,
    setItem,
    getEdge,
    getNode,
    speedJitter,
  ])

  // Extend the store with the put on belt functionality
  useEffect(() => {
    // Sanity check
    if (!getItem || !setItem || !setState) return

    // If current store state already has the put on belt function, return
    if (typeof getState().putOnBelt === 'function') return

    // Extend the store with the put on belt function
    setState(draft => ({
      ...draft,

      // Put an item on a belt
      putOnBelt: ({ itemId, beltId }) => {
        // Sanity check
        if (!itemId || !beltId) return

        // Get the belt
        const belt = getEdge(beltId)

        // Sanity check
        if (!belt) return

        // Get the item
        const item = getItem(itemId)

        // Sanity check
        if (!item) return

        // Put the item on the start of the belt
        setItem({
          ...item,
          location: {
            id: beltId,
            distance: 0,
          },
        })
      },
    }))
  }, [getEdge, getItem, getState, setItem, setState])
}

export default useBeltDriveFeature
