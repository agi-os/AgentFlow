/**
 * Transport belt is a belt transporting items on the edge path between two nodes.
 * It uses buckets to store items, each bucket is a fixed pixel length of the path.
 * Belt has the speed factor which determines the speed of the movement, the speed
 * indicates on how many ticks the belt moves items to the next bucket if space is available.
 */

import BaseEdgeComponent from '../BaseEdgeComponent'
import Bucket from './Bucket'
import PathComponent from './PathComponent'
import useTransportBeltStore from '../../hooks/useTransportBeltStore'
import useBezierPath from '../../hooks/useBezierPath'
import useItemStore from '../../hooks/useItemState'
import ItemOnBelt from './ItemOnBelt'

/**
 * TransportBelt component that renders a BaseEdge with animated items on it.
 * @param {Object} props - The component props.
 * @param {string} props.id - The edge ID.
 * @param {number} props.sourceX - The source X coordinate.
 * @param {number} props.sourceY - The source Y coordinate.
 * @param {number} props.targetX - The target X coordinate.
 * @param {number} props.targetY - The target Y coordinate.
 * @param {string} props.sourcePosition - The source position.
 * @param {string} props.targetPosition - The target position.
 * @returns {JSX.Element} - The TransportBelt component.
 */
const TransportBelt = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}) => {
  // Use the transport belt store to get the length, bucket centers and pathD
  const { pathD, buckets } = useTransportBeltStore(id).getState()

  // Use the custom hook to handle pathD updates
  useBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    edgeId: id,
  })

  // Render the BaseEdge with animated items on it
  return (
    <>
      <BaseEdgeComponent edgeId={id} pathD={pathD} />

      <PathComponent id={id} />

      {buckets.map((_, index) => (
        <BucketCoords key={index} id={id} index={index} />
      ))}

      <ItemWrapper id={id} />
    </>
  )
}

// Wraps all items from all buckets in a foreignObject
const ItemWrapper = ({ id }) => {
  const { buckets } = useTransportBeltStore(id).getState()

  return buckets.map((bucket, index) => {
    const { itemId } = bucket.getState()
    return <BucketItem key={index} itemId={itemId} />
  })
}

import { useEffect, useState } from 'react'

// Represents a single item in a bucket
const BucketItem = ({ itemId }) => {
  // Get the item coordinates
  const item = useItemStore(itemId)
  const { coordinates } = item

  // Set the transition duration to 0ms initially and then to 950ms after a delay to prevent initial jump
  const [transitionDuration, setTransitionDuration] = useState('0ms')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTransitionDuration('950ms')
    }, 200)

    return () => clearTimeout(timeoutId)
  }, [])

  // Do not render when coordinates are not defined
  if (!coordinates || !coordinates.x || !coordinates.y) {
    return null
  }

  return (
    <foreignObject
      x={coordinates.x}
      y={coordinates.y}
      className="overflow-visible transition-all"
      style={{
        transitionDuration,
        transitionTimingFunction: 'linear',
      }}>
      <ItemOnBelt id={itemId} />
    </foreignObject>
  )
}

// Render each bucket on the center of it's coordinates
const BucketCoords = ({ id, index }) => {
  const { buckets } = useTransportBeltStore(id).getState()
  const bucket = buckets[index]
  const coordinates = bucket.getState().coordinates

  return (
    <foreignObject
      x={coordinates.x}
      y={coordinates.y}
      className="overflow-visible">
      <Bucket id={id} index={index} />
    </foreignObject>
  )
}

export default TransportBelt
