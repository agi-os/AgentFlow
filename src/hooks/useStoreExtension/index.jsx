import { useEffect } from 'react'

import generateId from './generateId'
import addInitialItemsToStore from './addInitialItemsToStore'
import { useStore, useStoreApi } from '@xyflow/react'
import debounce from './debounce'

import addItem from './addItem'
import updateItemLocationLookup from './updateItemLocationLookup'
import updateItemLookup from './updateItemLookup'
import _getLocationItems from './getLocationItems'
import getLocationItemsSorted from './getLocationItemsSorted'
import lookup from './lookup'

/**
 * Custom hook that enhances the store with additional functionality.
 * @param {Object} options - The options for the enhanced store.
 * @param {Array} options.initialItems - The initial items to add to the store.
 * @returns {Object} - The enhanced store object.
 */
const useEnhancedStore = ({ initialItems }) => {
  const store = useStoreApi()

  // Extend the store with custom methods
  useEffect(() => {
    // Sanity check
    if (!store) return

    // If the store has been extended previously, abort
    if (store.getState().generateId) return

    // Initialize the store with the new methods
    store.setState(draft => ({
      ...draft,

      // Tick length in ms, this is base unit of all operations, 16.666ms = 60fps
      tickLength: 50,

      // System wide speed of all belts
      speed: 1000,

      setSpeed: debounce(speed =>
        store.setState(draft => {
          console.log('Setting speed from', draft.speed, 'to', speed)
          return {
            ...draft,
            speed: parseFloat(speed),
          }
        }, 200)
      ),

      // List of all belts
      beltIds: [],

      // Id of the setInterval loop calling beltDriveTick
      beltDriveIntervalId: null,

      items: [],
      addItem: item => addItem({ store, item }),
      setItem: item => addItem({ store, item }),

      itemLookup: new Map(),
      updateItemLookup: debounce(() => updateItemLookup(store)),
      getItem: id => store.getState().itemLookup.get(id),
      removeItem: id => {
        store.getState().itemLookup.delete(id)
        store.setState(draft => ({
          ...draft,
          items: draft.items.filter(item => item.id !== id),
        }))
        store.getState().updateItemLookup()
        store.getState().updateItemLocationLookup()
      },

      itemLocationLookup: new Map(),
      updateItemLocationLookup: debounce(() => updateItemLocationLookup(store)),
      getLocationItems: locationId => _getLocationItems({ store, locationId }),
      getLocationItemsSorted: locationId =>
        getLocationItemsSorted({ store, locationId }),

      generateId,
      getNode: id => store.getState().nodeLookup.get(id),
      getEdge: id => store.getState().edgeLookup.get(id),
      lookup: id => lookup({ store, id }),

      // Get all edges connected to the node
      getNodeEdges: nodeId =>
        store
          .getState()
          .edges.filter(
            edge => edge.source === nodeId || edge.target === nodeId
          ),
    }))
  }, [store])

  // Get the tick counter from the store
  const tickCounter = useStore(s => s.tickCounter)

  // Tick counter will increment every tick, tasks that are not time critical can be run on every nth tick
  useEffect(() => {
    if (tickCounter % 50 !== 0) return

    console.log('Tick counter', tickCounter)

    // Get the current edges from the store
    const draft = store.getState()

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
      store.setState(draft => ({
        ...draft,
        beltIds: newBeltIds,
      }))
    }
  }, [tickCounter, store])

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

  // Get the belt drive function from the store
  const beltDrive = useStore(s => s.beltDrive)

  // Extend the store with the tick functionality
  useEffect(() => {
    // Sanity check
    if (!store || !beltDrive) return

    // Extend the store with the tick count if it does not exist
    store.setState(draft => {
      return {
        ...draft,
        tickCounter: 0,
      }
    })

    // Extend the store with the tick function
    store.setState(draft => {
      return {
        ...draft,
        tick: () => {
          // Increment the tick counter
          store.setState(draft => {
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
  }, [store, beltDrive])

  // Get the speed, belt ids and getLocationItems function from the store
  const speed = useStore(s => s.speed)
  const beltIds = useStore(s => s.beltIds)
  const getLocationItems = useStore(s => s.getLocationItems)

  // Extend the store with the belt drive functionality
  useEffect(() => {
    // Sanity check
    if (!speed) return
    if (!getLocationItems) return

    console.log('Updating belt drive store', {
      store,
      speed,
      getLocationItems,
      beltIds,
    })

    store.setState(draft => {
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
            store.getState().setItem({
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
  }, [store, speed, getLocationItems, beltIds])

  // Initializing with initial items
  useEffect(() => {
    // Get the current items from the store
    const items = store.getState().items

    // If the store has not yet been initialized abort
    if (!items) return

    // If the store.items has more than 0 entries, abort
    if (items?.length > 0) return

    // Add initial items as needed
    addInitialItemsToStore({ store, initialItems })
  }, [store, initialItems])

  // Create a subscription to the store updating the window.store object
  useEffect(() => {
    if (!window.store) {
      window.store = store.getState()
      store.subscribe(s => (window.store = s))
    }
  }, [store])

  return store
}

export default useEnhancedStore
