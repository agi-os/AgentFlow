/**
 * Queue is an edge visually representing a belt conveyor with a queue of items on it.
 * @param {Object} props - The component props.
 * @param {string} props.id - The unique identifier of the Queue edge.
 * @param {Object} props.data - The data associated with the Queue edge.
 * @returns {JSX.Element} The rendered Queue edge component.
 */

import usePathAnimation from '../../hooks/usePathAnimation'
import { useStore } from '@xyflow/react'
import BaseEdgeComponent from '../BaseEdgeComponent'
// import PathComponent from './PathComponent'
// import ForeignObjectComponent from './ForeignObjectComponent'
import { useEffect } from 'react'

const Queue = ({
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
    }
  }, [edge, sourceNode])

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
      {/* <PathComponent
        pathD={pathD}
        markerEnd={markerEnd}
        markerStart={markerStart}
        pathRef={pathRef}
      /> */}
      {/* <ForeignObjectComponent
        sourceNode={sourceNode}
        edge={edge}
        divRef={divRef}
      /> */}
    </>
  )
}

export default Queue
