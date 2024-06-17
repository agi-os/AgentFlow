import getTransportBeltBucketStore from '../stores/transportBeltBucket'

/**
 * A custom hook that provides access to the transport belt store.
 *
 * @param {string} props - The props defining the transport belt store bucket.
 * @returns {Object} - The current state of the transport belt store.
 */
const useTransportBeltBucketStore = props => {
  // Get the store for the given props
  const store = getTransportBeltBucketStore(props)

  // Return the store
  return store
}

export default useTransportBeltBucketStore
