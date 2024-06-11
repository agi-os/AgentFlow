import { useEffect, useRef, useCallback } from 'react'
import { useReactFlow, useStore, useStoreApi } from '@xyflow/react'
import isEqualWith from 'lodash.isequalwith'
import debounce from '../debounce'
import dataTypesConfig from './dataTypesConfig'
import loadDataFromStore from './loadDataFromStore'
import saveDataToStore from './saveDataToStore'
import { normalizePositions } from '../../../utils/graph'

/**
 * Custom React hook for managing database operations in a React Flow application.
 *
 * This hook provides functionality to load data from a database on component mount,
 * and to save data to the database in a debounced and periodic manner.
 *
 * The data types and their corresponding stores are defined in the dataTypesConfig object.
 * The loadDataFromStore and saveDataToStore functions are used to interact with the database.
 *
 * The hook uses useEffect to load data when the component mounts, and to set up periodic saves.
 * It uses useCallback to create a memoized version of the saveData function, which is called
 * periodically and debounced to prevent being called multiple times in a short time frame.
 *
 * The hook also uses useRef to store the previous data state, which is compared to the current
 * state to determine whether a save is necessary.
 *
 * @returns {void}
 */
const useDatabaseFeature = () => {
  const { setNodes, setEdges } = useReactFlow()
  const setItem = useStore(s => s.setItem)
  const { getState } = useStoreApi()

  // Load Data on Component Mount
  useEffect(() => {
    // Check if all required functions are available
    if (!setNodes || !setEdges || !setItem) return

    // This function is responsible for loading data from the database
    const loadFromDB = async () => {
      try {
        // Iterate over each type in the dataTypesConfig object
        await Promise.all(
          Object.entries(dataTypesConfig).map(async ([type, { store }]) => {
            // Load data from the store for the current type
            const data = await loadDataFromStore(store)

            // Depending on the type, perform different actions with the loaded data
            switch (type) {
              case 'nodes':
                // If the type is 'nodes', set the loaded data as nodes
                setNodes(data)
                break
              case 'edges':
                // If the type is 'edges', set the loaded data as edges
                setEdges(data)
                break
              case 'items':
                // If the type is 'items', set each item in the loaded data
                data.forEach(item => setItem(item))
            }
          })
        )
      } catch (error) {
        // If there is an error during the data loading process, log the error to the console
        console.error('Error loading data:', error)
      }
    }

    // Call the loadFromDB function to load data when the component mounts
    loadFromDB()
  }, [setEdges, setItem, setNodes])

  // Debounced to prevent being called multiple times in short time frame
  const debouncedSave = useRef(
    debounce(
      'saveDataToIndexedDB',
      async dataToSave => {
        try {
          // Apply normalizePositions to nodes before saving
          const normalizedData = { ...dataToSave }
          if (normalizedData.nodes) {
            // Transform nodes into format expected by normalizePositions
            const nodesForNormalization = normalizedData.nodes.reduce(
              (obj, node) => {
                obj[node.id] = [null, node.position.x, node.position.y, null]
                return obj
              },
              {}
            )

            // Center nodes around (0, 0)
            const normalizedNodes = normalizePositions({
              n: nodesForNormalization,
            })

            // Transform back to original format
            normalizedData.nodes = Object.entries(normalizedNodes.n).map(
              ([id, [, x, y]]) => ({
                ...normalizedData.nodes.find(n => n.id === id),
                // Get other node properties
                position: { x, y },
              })
            )
          }

          // Iterate over each type in the normalizedData object
          await Promise.all(
            Object.entries(normalizedData).map(async ([type, data]) => {
              // Get the corresponding store for the current type from the dataTypesConfig object
              const store = dataTypesConfig[type].store

              // Call the saveDataToStore function to save the data to the store for the current type
              await saveDataToStore(store, data)
            })
          )
        } catch (error) {
          console.error('Error saving data to IndexedDB:', error)
        }
      },
      1_000

      // Limited to one time per second
    )
  ).current

  const previousData = useRef({}).current

  // This function is responsible for saving data to the database
  const saveData = useCallback(() => {
    // Get the current state of the data by iterating over each type in the dataTypesConfig object
    // and applying the selector and filter functions (if they exist) to the current state
    const currentState = Object.entries(dataTypesConfig).reduce(
      (acc, [type, { selector, filter }]) => ({
        ...acc,
        [type]: filter ? filter(selector(getState())) : selector(getState()),
      }),
      {}
    )

    // Compare the current state of the data to the previous state to determine whether a save is necessary
    // The isEqualWith function is used to perform a deep comparison of the arrays, checking for equality of ids
    if (
      !isEqualWith(previousData, currentState, (a, b) => {
        if (Array.isArray(a) && Array.isArray(b)) {
          return (
            a.length === b.length &&
            a.every(itemA => b.some(itemB => itemA.id === itemB.id))
          )
        }
      })
    ) {
      // If the data has changed, call the debouncedSave function to save the data to the database
      debouncedSave(currentState)

      // Update the previous data state with the current state
      previousData.items = currentState.items
      previousData.nodes = currentState.nodes
      previousData.edges = currentState.edges
    }
  }, [getState, debouncedSave, previousData])

  // Check for a quick save every 2 seconds
  useEffect(() => {
    const intervalId = setInterval(saveData, 2_000)
    return () => clearInterval(intervalId)
  }, [saveData])

  // Flush all data to the database every minute
  useEffect(() => {
    const intervalId = setInterval(saveData, 60_000)
    return () => clearInterval(intervalId)
  }, [saveData])
}

export default useDatabaseFeature
