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
    </>
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
