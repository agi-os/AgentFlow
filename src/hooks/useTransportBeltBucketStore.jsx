import getTransportBeltBucketStore from '../stores/transportBeltBucket'
import { useEffect, useState } from 'react'

/**
 * A custom hook that provides access to the transport belt store.
 *
 * @param {string} props - The props defining the transport belt store bucket.
 * @returns {Object} - The current state of the transport belt store.
 */
const useTransportBeltBucketStore = props => {
  // Get the store for the given props
  const bucketStore = getTransportBeltBucketStore(props)

  // Initialize a state variable state with the initial value from the bucketStore
  const [reactState, setReactState] = useState(bucketStore.getState())

  // Use the useEffect hook to subscribe to changes in the bucketStore
  useEffect(() => {
    // Subscribe to the bucketStore
    bucketStore.subscribe(storeState => {
      // Update the state state variable whenever the state changes
      setReactState(storeState)
    })
  }, [bucketStore])

  // Return the state
  return reactState
}

export default useTransportBeltBucketStore
