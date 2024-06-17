import useTransportBeltBucketStore from '../../hooks/useTransportBeltBucketStore'
import useItemStore from '../../hooks/useItemStore'
import { className } from './config'
import { useEffect, useState } from 'react'

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
  // Get the data for the transport belt bucket using the useTransportBeltBucketStore hook
  const { itemId } = useTransportBeltBucketStore({
    transportBeltIndex: index,
    transportBeltId: id,
  })

  // Return JSX to render the component
  return (
    <div className={className.join(' ')}>
      {itemId && <ItemOnBelt itemId={itemId} />}
    </div>
  )
}

const ItemOnBelt = ({ itemId }) => {
  // Get the coordinates and emoji for the item using the useItemStore hook
  const { coordinates, emoji } = useItemStore(itemId)

  // Return JSX to render the component
  return (
    <div
      className="relative"
      style={{
        transition: 'all 900ms ease-in-out',
        left: `${coordinates.x}px`,
        top: `${coordinates.y}px`,
      }}>
      {emoji}
    </div>
  )
}

export default Bucket
