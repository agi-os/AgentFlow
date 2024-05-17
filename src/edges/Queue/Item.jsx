import { useEffect, useRef } from 'react'
import DivItem from './DivItem'

const Item = ({ item, pathRef, pathLength }) => {
  // Create a ref for the item's div element
  const divRef = useRef(null)

  // Update the item's location on the path
  useEffect(() => {
    // abort if ref is unavailable
    if (!pathRef.current || !divRef.current) return

    // Get the distance of the item on the path
    const distance = 1 - (item.location.distance || item.location.queue || 0)

    // Calculate the target point on the path
    const targetPoint = pathRef.current.getPointAtLength(pathLength * distance)

    // Update the item's location
    divRef.current.style.transform = `translate(${targetPoint.x}px, ${targetPoint.y}px)`
  }, [item, pathLength, pathRef])

  // Render the item
  return (
    <foreignObject
      x-id={item.id}
      x={0}
      y={0}
      width="1"
      height="1"
      overflow="visible">
      <DivItem item={item} divRef={divRef} />
    </foreignObject>
  )
}

export default Item
