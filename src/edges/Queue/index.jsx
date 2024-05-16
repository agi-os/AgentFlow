/**
 * Queue is an edge visually representing a belt conveyor with a queue of items on it.
 * @param {Object} props - The component props.
 * @param {string} props.id - The unique identifier of the Queue edge.
 * @param {Object} props.data - The data associated with the Queue edge.
 * @returns {JSX.Element} The rendered Queue edge component.
 */

import { useStore, getBezierPath } from '@xyflow/react'
import BaseEdgeComponent from '../BaseEdgeComponent'
import PathComponent from './PathComponent'
import { useEffect, useRef, useState } from 'react'
import Item from './Item'

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
  // Get the items on the belt
  const items = useStore(s => s.getLocationItemsSorted(id))

  // Create refs for the path element
  const pathRef = useRef(null)

  // Path's d attribute value
  const [pathD, setPathD] = useState('')

  useEffect(() => {
    // Get the path's d attribute value
    const [pathD] = getBezierPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
    })
    setPathD(pathD)
  }, [sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition])

  // Get the total length of the path
  const length = pathRef?.current?.getTotalLength?.() || 0

  // The speed of the dash animation in milliseconds per cycle
  const dashSpeed = 1400

  // Sanity check
  if (!typeof pathD === 'string' || pathD.length === 0) {
    return null
  }

  // Render the BaseEdge with animated items on it
  return (
    <>
      <BaseEdgeComponent
        edgeId={id}
        pathD={pathD}
        markerEnd={markerEnd}
        dashSpeed={dashSpeed}
      />
      <PathComponent
        edgeId={id}
        pathD={pathD}
        markerEnd={markerEnd}
        markerStart={markerStart}
        pathRef={pathRef}
      />

      {items
        .reverse()
        .map(
          item =>
            item && (
              <Item
                key={item.id}
                item={item}
                pathRef={pathRef}
                pathLength={length}
              />
            )
        )}
    </>
  )
}

export default Queue
