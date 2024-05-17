import { useStore } from '@xyflow/react'
import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import DivItem from './DivItem'

const Item = ({ item, pathRef, pathLength }) => {
  // Create a ref for the item's div element
  const divRef = useRef(null)

  // Get the current zoom level
  const zoomLevel = useStore(s => s.transform[2])

  // Use the intersection observer to only render parts of the items when they are in view to improve performance
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.01,
  })

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
      <DivItem
        item={item}
        divRef={divRef}
        ref={ref}
        inView={inView}
        zoomLevel={zoomLevel}
      />
    </foreignObject>
  )
}

export default Item
