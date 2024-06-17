import { useEffect, useState } from 'react'
import useTransportBeltBucketStore from '../../hooks/useTransportBeltBucketStore'
import { className } from './config'

/**
 * Bucket component that displays the index and data of a transport belt bucket.
 *
 * @param {Object} props - The props object.
 * @param {string} props.id - The ID of the transport belt.
 * @param {number} props.index - The index of the bucket in the transport belt.
 *
 * @returns {JSX.Element} - The JSX element representing the Bucket component.
 */
const Bucket = ({ id, index }) => {
  // Use the custom hook useTransportBeltBucketStore to get a reference to the bucket from the state
  const bucketStore = useTransportBeltBucketStore({
    transportBeltIndex: index,
    transportBeltId: id,
  })

  // Initialize a state variable data with the initial value from the bucketStore
  const [data, setData] = useState(bucketStore.getState().data)

  // Use the useEffect hook to subscribe to changes in the bucketStore
  useEffect(() => {
    // Subscribe to the bucketStore and update the data state variable whenever the state changes
    bucketStore.subscribe(state => {
      setData(state.data)
    })
  }, [bucketStore]) // Only run this effect when bucketStore changes

  // Return JSX to render the component
  return (
    <div className={className.join(' ')}>
      {index}
      {JSON.stringify(data)}
    </div>
  )
}

export default Bucket
