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
const Bucket = ({ index }) => {
  // Return JSX to render the component
  return <div className={className.join(' ')}>{index + 1}</div>
}

export default Bucket
