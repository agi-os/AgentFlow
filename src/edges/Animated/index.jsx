import usePathAnimation from '../../hooks/usePathAnimation'
import { useStore } from '@xyflow/react'
import BaseEdgeComponent from './BaseEdgeComponent'
import PathComponent from './PathComponent'
import ForeignObjectComponent from './ForeignObjectComponent'
import beltItemClassNames from './beltItemClassNames'

/**
 * Animated component represents an animated edge in a flow diagram.
 *
 * @param {Object} props - The props for the Animated component.
 * @param {number} props.sourceX - The x-coordinate of the source point.
 * @param {number} props.sourceY - The y-coordinate of the source point.
 * @param {number} props.targetX - The x-coordinate of the target point.
 * @param {number} props.targetY - The y-coordinate of the target point.
 * @param {string} props.sourcePosition - The position of the source point relative to the source node.
 * @param {string} props.targetPosition - The position of the target point relative to the target node.
 * @param {string} props.markerEnd - The marker to be placed at the end of the edge.
 * @param {string} props.markerStart - The marker to be placed at the start of the edge.
 * @returns {JSX.Element} The rendered Animated component.
 */
const Animated = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  markerStart,
}) => {
  // Get the edge data from the store
  const edge = useStore(s => s.edgeLookup.get(id))

  // Get the source node data from the store
  const sourceNode = useStore(s => s.nodeLookup.get(edge.source))

  const { pathRef, divRef, pathD } = usePathAnimation(
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition
  )

  // The speed of the dash animation in milliseconds per cycle
  const dashSpeed = 100

  // Sanity check
  if (!typeof pathD === 'string' || pathD.length === 0) {
    return null
  }

  // Render the BaseEdge with animated item on it
  return (
    <>
      <BaseEdgeComponent
        pathD={pathD}
        markerEnd={markerEnd}
        dashSpeed={dashSpeed}
      />
      <PathComponent
        pathD={pathD}
        markerEnd={markerEnd}
        markerStart={markerStart}
        pathRef={pathRef}
      />
      <ForeignObjectComponent sourceNode={sourceNode} divRef={divRef} />
    </>
  )
}

export const StoreItemOnBelt = ({ node }) => {
  // Get the first item from the chest
  const itemId = node?.data?.items?.[0]?.id

  // Get the item's emoticon
  const emoticon = useStore(s => s.getItem(itemId)?.emoticon)

  // Render the first item on the belt
  return (
    <div x-id={itemId} className={beltItemClassNames.join(' ')}>
      {emoticon}
    </div>
  )
}

export default Animated
