import getSplitterStore from '.'
import { useEffect, useState } from 'react'
import { useStoreApi } from '@xyflow/react'

/**
 * Custom React hook that manages the state of a splitter component.
 *
 * @param {string} id - The unique identifier for the splitter component.
 * @returns {Object} The current state of the splitter component.
 */
const useSplitterState = id => {
  // Use the useStoreApi hook to access the store API
  const storeApi = useStoreApi()

  // Use the useState hook to create a state variable for the splitter component
  // The initial state is set to the current state of the splitter store
  const [splitterState, setSplitterState] = useState(
    getSplitterStore(id, storeApi).getState()
  )

  // Use the useEffect hook to subscribe to changes in the splitter store
  useEffect(() => {
    // Get the splitter store for the given id and subscribe to changes
    // The setSplitterState function is called whenever the splitter store changes
    const unsubscribe = getSplitterStore(id, storeApi).subscribe(
      setSplitterState
    )

    // Return a cleanup function that unsubscribes from the splitter store when the component unmounts
    return () => unsubscribe()
  }, [id, storeApi])

  // Return the current state of the splitter component
  return splitterState
}

export default useSplitterState
