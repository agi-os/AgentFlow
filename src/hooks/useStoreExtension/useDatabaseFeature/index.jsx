import { useEffect, useRef } from 'react'
import { useReactFlow, useStoreApi } from '@xyflow/react'
import isEqualWith from 'lodash.isequalwith'
import debounce from '../debounce'
import dataTypesConfig from './dataTypesConfig'
import loadDataFromStore from './loadDataFromStore'
import saveDataToStore from './saveDataToStore'

// --- End IndexedDB Helper Functions ---

// --- Main React Hook ---
const useDatabaseFeature = () => {
  const { setNodes, setEdges } = useReactFlow()
  const { getState, setState } = useStoreApi()

  // Load Data on Component Mount
  useEffect(() => {
    const loadFromDB = async () => {
      try {
        // Use Object.entries to iterate over dataTypesConfig
        const promises = Object.entries(dataTypesConfig).map(
          async ([type, { store }]) => {
            const data = await loadDataFromStore(store)
            if (type === 'nodes') setNodes(data)
            if (type === 'edges') setEdges(data)
            if (type === 'items') setState(state => ({ ...state, items: data }))
          }
        )

        await Promise.all(promises) // Wait for all data to load
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    loadFromDB()
  }, [setEdges, setNodes, setState])

  // --- Throttling and Deep Comparison Logic ---

  // Debounced to prevent being called multiple times in short time frame
  const debouncedSave = useRef(
    debounce(
      'saveDataToIndexedDB',
      async dataToSave => {
        try {
          const promises = Object.entries(dataToSave).map(
            async ([type, data]) => {
              const store = dataTypesConfig[type].store
              await saveDataToStore(store, data)
            }
          )
          await Promise.all(promises)
        } catch (error) {
          console.error('Error saving data to IndexedDB:', error)
        }
      },
      1_000 // Limited to one time per second
    )
  ).current

  const previousData = useRef({}).current

  // Check for a quick save every 2 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentState = {}
      for (const type in dataTypesConfig) {
        currentState[type] = dataTypesConfig[type].filter
          ? dataTypesConfig[type].filter(
              dataTypesConfig[type].selector(getState())
            )
          : dataTypesConfig[type].selector(getState())
      }

      if (
        !isEqualWith(previousData, currentState, (a, b) => {
          // ID-based comparison
          if (Array.isArray(a) && Array.isArray(b)) {
            return (
              a.length === b.length &&
              a.every(itemA => b.some(itemB => itemA.id === itemB.id))
            )
          }
        })
      ) {
        debouncedSave(currentState)
        previousData.items = currentState.items
        previousData.nodes = currentState.nodes
        previousData.edges = currentState.edges
      }
    }, 2_000)

    return () => clearInterval(intervalId)
  }, [getState, debouncedSave, previousData])

  // Flush all data to database every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentState = {}
      for (const type in dataTypesConfig) {
        currentState[type] = dataTypesConfig[type].filter
          ? dataTypesConfig[type].filter(
              dataTypesConfig[type].selector(getState())
            )
          : dataTypesConfig[type].selector(getState())
      }

      debouncedSave(currentState)
      previousData.items = currentState.items
      previousData.nodes = currentState.nodes
      previousData.edges = currentState.edges
    }, 60_000)

    return () => clearInterval(intervalId)
  }, [getState, debouncedSave, previousData])

  // --- End Throttling and Deep Comparison Logic ---
}

export default useDatabaseFeature
