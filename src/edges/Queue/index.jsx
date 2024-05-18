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
}) => {
  // Get the items on the belt
  const items = useStore(s => s.getLocationItemsSorted(id))

  // Reference to the path element
  const pathRef = useRef(null)

  // Path's d attribute value
  const [pathD, setPathD] = useState('')

  // Length of the path
  const [length, setLength] = useState(0)

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

  // Render the BaseEdge with animated items on it
  return (
    <>
      <BaseEdgeComponent edgeId={id} pathD={pathD} />

      <PathComponent
        pathD={pathD}
        onLengthChange={setLength}
        pathRef={pathRef}
      />

      {length > 0 &&
        items.map(
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
