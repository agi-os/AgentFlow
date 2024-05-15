import usePathAnimation from '../../hooks/usePathAnimation'
import { useStore } from '@xyflow/react'
import BaseEdgeComponent from './BaseEdgeComponent'
import PathComponent from './PathComponent'
import ForeignObjectComponent from './ForeignObjectComponent'
import { useEffect } from 'react'

/**
 * Animated component represents an animated edge in a flow diagram.
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

  // Get the moveItemFromNodeToEdge function from the store
  const moveItemFromNodeToEdge = useStore(s => s.moveItemFromNodeToEdge)

  const { pathRef, divRef, pathD } = usePathAnimation(
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition
  )

  useEffect(() => {
    // If there are no source items, abort processing
    if (!sourceNode?.data?.items) return

    // Current belt items
    const beltItems = edge?.data?.items || []

    // Move the first item from the source node to the edge if the belt is empty
    if (beltItems.length === 0) {
      // Get the id of the first item in the source node
      const itemId = sourceNode?.data?.items?.[0]
      const edgeId = edge.id
      const nodeId = sourceNode.id

      console.log({ itemId, edgeId, nodeId })

      moveItemFromNodeToEdge({ itemId, nodeId, edgeId })
    }
  }, [edge, sourceNode, moveItemFromNodeToEdge])

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
      <ForeignObjectComponent
        sourceNode={sourceNode}
        edge={edge}
        divRef={divRef}
      />
    </>
  )
}

export default Animated
