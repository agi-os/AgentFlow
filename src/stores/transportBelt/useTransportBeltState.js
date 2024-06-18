import getTransportBeltStore from '.'
import { useEffect, useState } from 'react'
import { useStoreApi } from '@xyflow/react'

/**
 * Custom React hook that manages the state of a transport belt component.
 *
 * @param {string} id - The unique identifier for the transport belt component.
 * @returns {Object} The current state of the transport belt component.
 */
const useTransportBeltState = id => {
  // Use the useStoreApi hook to access the store API
  const storeApi = useStoreApi()

  // Use the useState hook to create a state variable for the transport belt component
  // The initial state is set to the current state of the transport belt store
  const [transportBeltState, setTransportBeltState] = useState(
    getTransportBeltStore(id, storeApi).getState()
  )

  // Use the useEffect hook to subscribe to changes in the transport belt store
  useEffect(() => {
    // Get the transport belt store for the given id and subscribe to changes
    // The setTransportBeltState function is called whenever the transport belt store changes
    const unsubscribe = getTransportBeltStore(id, storeApi).subscribe(
      setTransportBeltState
    )

    // Return a cleanup function that unsubscribes from the transport belt store when the component unmounts
    return () => unsubscribe()
  }, [id, storeApi])

  // Return the current state of the transport belt component
  return transportBeltState
}

export default useTransportBeltState
