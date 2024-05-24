import { useEffect, useRef, useCallback } from 'react'
import { useReactFlow, useStore, useStoreApi } from '@xyflow/react'
import isEqualWith from 'lodash.isequalwith'
import debounce from '../debounce'
import dataTypesConfig from './dataTypesConfig'
import loadDataFromStore from './loadDataFromStore'
import saveDataToStore from './saveDataToStore'

const useDatabaseFeature = () => {
  const { setNodes, setEdges } = useReactFlow()
  const setItem = useStore(s => s.setItem)
  const { getState } = useStoreApi()

  // Load Data on Component Mount
  useEffect(() => {
    // Check if all required functions are available
    if (!setNodes || !setEdges || !setItem) return

    const loadFromDB = async () => {
      try {
        await Promise.all(
          Object.entries(dataTypesConfig).map(async ([type, { store }]) => {
            const data = await loadDataFromStore(store)
            switch (type) {
              case 'nodes':
                setNodes(data)
                break
              case 'edges':
                setEdges(data)
                break
              case 'items':
                data.forEach(item => setItem(item))
            }
          })
        )
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    loadFromDB()
  }, [setEdges, setItem, setNodes])

  // Debounced to prevent being called multiple times in short time frame
  const debouncedSave = useRef(
    debounce(
      'saveDataToIndexedDB',
      async dataToSave => {
        try {
          await Promise.all(
            Object.entries(dataToSave).map(async ([type, data]) => {
              const store = dataTypesConfig[type].store
              await saveDataToStore(store, data)
            })
          )
        } catch (error) {
          console.error('Error saving data to IndexedDB:', error)
        }
      },
      1_000 // Limited to one time per second
    )
  ).current

  const previousData = useRef({}).current

  const saveData = useCallback(() => {
    const currentState = Object.entries(dataTypesConfig).reduce(
      (acc, [type, { selector, filter }]) => ({
        ...acc,
        [type]: filter ? filter(selector(getState())) : selector(getState()),
      }),
      {}
    )

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
      debouncedSave(currentState)
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
