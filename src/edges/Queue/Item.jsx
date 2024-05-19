import { useEffect } from 'react'
import DivItem from './DivItem'
import { useState } from 'react'
import { useStore } from '@xyflow/react'

const Item = ({ item, pathRef, pathLength }) => {
  // Prepare the transform value
  const [transform, setTransform] = useState('')

  // Get the tick from the store
  const tickCounter = useStore(s => s.tickCounter)

  // Update the transform value
  useEffect(() => {
    // Get the distance of the item on the path
    const distance = item.location.distance || 0

    // Calculate the target point on the path
    const targetPoint = pathRef.current.getPointAtLength(pathLength * distance)

    // Update the transform value
    setTransform(`translate3d(${targetPoint.x}px, ${targetPoint.y}px, 0)`)
  }, [item, pathLength, pathRef, tickCounter])

  // Render the item
  return (
    <foreignObject
      x-id={item.id}
      x={0}
      y={0}
      width="1"
      height="1"
      overflow="visible">
      <DivItem item={item} transform={transform} />
    </foreignObject>
  )
}

export default Item
