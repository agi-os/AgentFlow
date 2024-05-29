import { useEffect, useState } from 'react'
import { useStoreApi, useStore } from '@xyflow/react'

const itemsIsArraySelector = s => Array.isArray(s.items)
const itemLookupIsMapSelector = s => s.itemLookup instanceof Map
const itemLocationLookupIsMapSelector = s => s.itemLocationLookup instanceof Map
const typedLocationItemsIsMapSelector = s => s.typedLocationItems instanceof Map
const setItemIsFunctionSelector = s => typeof s.setItem === 'function'
const getItemIsFunctionSelector = s => typeof s.getItem === 'function'
const updateItemLookupIsFunctionSelector = s =>
  typeof s.updateItemLookup === 'function'
const updateItemLocationLookupIsFunctionSelector = s =>
  typeof s.updateItemLocationLookup === 'function'
const getLocationItemsIsFunctionSelector = s =>
  typeof s.getLocationItemsIsFunction === 'function'

/**
 * Map of item management functionalities and their dependencies.
 */
const useItemManagementFeature = () => {
  // Get the handle to the store api
  const { getState, setState } = useStoreApi()

  // Get information about the items in the store
  const itemsIsArray = useStore(itemsIsArraySelector)
  const itemLookupIsMap = useStore(itemLookupIsMapSelector)
  const itemLocationLookupIsMap = useStore(itemLocationLookupIsMapSelector)
  const typedLocationItemsIsMap = useStore(typedLocationItemsIsMapSelector)
  const setItemIsFunction = useStore(setItemIsFunctionSelector)
  const getItemIsFunction = useStore(getItemIsFunctionSelector)
  const updateItemLookupIsFunction = useStore(
    updateItemLookupIsFunctionSelector
  )
  const updateItemLocationLookupIsFunction = useStore(
    updateItemLocationLookupIsFunctionSelector
  )
  const getLocationItemsIsFunction = useStore(
    getLocationItemsIsFunctionSelector
  )

  // Add the baseline item stores
  useEffect(() => {
    if (!setState || itemsIsArray) return
    setState(draft => ({ ...draft, items: [] }))
  }, [setState, itemsIsArray])

  useEffect(() => {
    if (!setState || itemLookupIsMap) return
    setState(draft => ({ ...draft, itemLookup: new Map() }))
  }, [setState, itemLookupIsMap])

  useEffect(() => {
    if (!setState || itemLocationLookupIsMap) return
    setState(draft => ({ ...draft, itemLocationLookup: new Map() }))
  }, [setState, itemLocationLookupIsMap])

  useEffect(() => {
    if (!setState || typedLocationItemsIsMap) return
    setState(draft => ({ ...draft, typedLocationItems: new Map() }))
  }, [setState, typedLocationItemsIsMap])

  useEffect(() => {
    if (
      !itemsIsArray ||
      !updateItemLookupIsFunction ||
      !updateItemLocationLookupIsFunction ||
      !setState ||
      setItemIsFunction
    )
      return
    setState(draft => ({
      ...draft,
      setItem: item => {
        // Update the items object
        setState(newState => {
          // If we have an id, check if the item already exists
          if (item?.id) {
            // If item exists, remove it
            newState.items = newState.items.filter(i => i.id !== item.id)
          }

          // If item has no id, generate one
          if (!item.id) item.id = newState.generateId()

          // If item has no location, abort
          if (!item.location) {
            console.warn('Item has no location', item)
            return
          }

          // Push the item to the store
          newState.items.push(item)

          // Make a shallow copy to signal change
          newState.items = [...newState.items]

          // Return draft
          return newState
        })

        // Update the item location lookup map
        getState().updateItemLocationLookup()

        // Update the item lookup map
        getState().updateItemLookup()

        // Return the handle to the new item
        return item
      },
    }))
  }, [
    getState,
    setItemIsFunction,
    itemsIsArray,
    updateItemLookupIsFunction,
    updateItemLocationLookupIsFunction,
    setState,
  ])

  useEffect(() => {
    if (!setState || !itemLookupIsMap || getItemIsFunction) return
    setState(draft => ({
      ...draft,
      getItem: id => getState().itemLookup.get(id),
    }))
  }, [getState, setState, getItemIsFunction, itemLookupIsMap])

  useEffect(() => {
    if (!setState || !itemLocationLookupIsMap || getLocationItemsIsFunction)
      return
    setState(draft => ({
      ...draft,
      getLocationItems: locationId => {
        const { itemLocationLookup, getItem } = getState()

        // Get the item ids for the location
        const itemIds = itemLocationLookup.get(locationId) || []

        // Map the item ids to items
        const items = itemIds.map(id => getItem(id) || null).filter(Boolean)

        // Return the items
        return items
      },
    }))
  }, [getState, setState, getLocationItemsIsFunction, itemLocationLookupIsMap])

  useEffect(() => {
    if (!setState || !itemLocationLookupIsMap || updateItemLookupIsFunction)
      return
    setState(draft => ({
      ...draft,
      updateItemLookup: () =>
        setState(draft => {
          // Create a new lookup map
          const itemLookup = new Map()

          // Populate the lookup map with the items
          draft.items.forEach(item => itemLookup.set(item.id, item))

          // Update the store with the new data
          return {
            ...draft,
            itemLookup,
          }
        }),
    }))
  }, [setState, itemLocationLookupIsMap, updateItemLookupIsFunction])

  useEffect(() => {
    if (!setState || !itemLocationLookupIsMap || updateItemLookupIsFunction)
      return

    setState(draft => ({
      ...draft,
      updateItemLocationLookup: () =>
        setState(draft => {
          // Create the Map directly within the function
          const lookup = new Map()
          draft.items.forEach(item => {
            const locationId = item.location.id
            if (!lookup.has(locationId)) {
              lookup.set(locationId, [])
            }
            lookup.get(locationId).push(item.id)
          })
          draft.itemLocationLookup = lookup
          return draft
        }),
    }))
  }, [
    setState,
    itemLocationLookupIsMap,
    updateItemLocationLookupIsFunction,
    updateItemLookupIsFunction,
  ])
}

/*
  

  getTypedLocationItems: {
    dependencies: ['typedLocationItems'],
    fn: draft => (locationId, type) =>
      draft.typedLocationItems.get(`${locationId}-${type}`) |||| [],
  },

  getLocationItems: {
    dependencies: ['getLocationItems', 'typedLocationItems', 'items'], // Correct dependencies
    fn: draft => locationId =>
      getLocationItems({ store: { getState: () => draft }, locationId }),
  },

  updateItemLocationLookup: {
    dependencies: ['items'],
    /**
     * Creates a map that efficiently looks up items by their location ID.
     * @param {Array} items - The array of items in the store.
     * @returns {Map} - A map where the keys are location IDs and the values are arrays of item IDs.
     *
    fn: draft => () => {
      // Create the Map directly within the function
      const lookup = new Map()
      draft.items.forEach(item => {
        const locationId = item.location.id
        if (!lookup.has(locationId)) {
          lookup.set(locationId, [])
        }
        lookup.get(locationId).push(item.id)
      })
      draft.itemLocationLookup = lookup
    },
  },

  updateTypedLocationItems: {
    dependencies: ['items'],
    /**
     * Creates a map that efficiently looks up items by their location ID and type.
     * @param {Array} items - The array of items in the store.
     * @returns {Map} - A map where the keys are locationId-type and the values are arrays of items.
     *
    fn: draft => () => {
      // Create the Map directly within the function
      const lookup = new Map()
      draft.items.forEach(item => {
        const key = `${item.location.id}-${item.type}`
        if (!lookup.has(key)) {
          lookup.set(key, [])
        }
        lookup.get(key).push(item)
      })
      draft.typedLocationItems = lookup
    },
  },
}

/**
 * Recursively tries to add a function to the store and its dependencies.
 * @param {Object} draft - The draft state object from `setState`.
 * @param {string} funcName - The name of the function to add.
 */

/*const addFunctionToStore = (draft, funcName) => {
  // If it's not in the map, assume it's an external dependency
  if (!(funcName in draft)) {
    console.error(`Dependency "${funcName}" not found in the store`)
    return
  }

  const { dependencies, fn } = itemManagementFunctions[funcName]

  // Recursively add dependencies (both internal and external)
  dependencies.forEach(dep => addFunctionToStore(draft, dep))

  // Check if all dependencies are met
  if (dependencies.some(dep => !(dep in draft))) {
    return
  }

  // Add the function to the store
  draft[funcName] = fn(draft)
}

/**
 * Recursively retrieves the store state until all requirements for a function are met.
 * @param {Object} store - The store object.
 * @param {string} funcName - The name of the function to check.
 * @returns {Object||null} - The store state if all requirements are met, null otherwise.
 */
/*const useStoreWithRequirements = ({ dependencies }) => {
  const { getState } = useStoreApi()
  const state = getState()

  // If any dependency is missing, try again later
  if (dependencies.some(dep => !(dep in state))) {
    return null
  }

  // All requirements are met, return the store state
  return state
}

const useCheckStoreValue = functionName => {
  const { dependencies } = itemManagementFunctions[functionName]
  const [conditionMet, setConditionMet] = useState(false)

  // Replace this with actual logic to check the store value
  const storeValue = useStoreWithRequirements({ dependencies })

  console.log(storeValue)

  if (storeValue) {
    setConditionMet(true)
  } else {
    // Schedule the next check if the condition hasn't been met yet
    const timeoutId = setTimeout(useCheckStoreValue, 1000) // Adjust the interval as needed
    return () => clearTimeout(timeoutId) // Cleanup function to clear the timeout
  }

  return null
}

/**
 * Custom hook for adding item management functionality to the store.
 */
// const useItemManagementFeature = () => {
//   const [conditionMet, setConditionMet] = useState(false)

//   useEffect(() => {
//     let intervalId

//     const checkStoreValues = () => {
//       Object.keys(itemManagementFunctions).forEach(functionName => {
//         const { dependencies } = itemManagementFunctions[functionName]
//         const storeValue = useStoreWithRequirements({ dependencies })

//         if (storeValue) {
//           setConditionMet(true)
//           clearInterval(intervalId) // Stop checking once condition is met
//         }
//       })
//     }

//     // Start checking immediately and then every 1 second
//     checkStoreValues()
//     intervalId = setInterval(checkStoreValues, 1000)

//     // Cleanup function
//     return () => clearInterval(intervalId)
//   }, []) // Empty dependency array means this effect runs once on mount

//   return null
// }

export default useItemManagementFeature
