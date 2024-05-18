import { BaseEdge, useStore } from '@xyflow/react'
import { memo } from 'react'

/**
 * Renders a base edge component.
 * @param {Object} props - The component props.
 * @param {string} props.pathD - The path data for the edge.
 * @returns {JSX.Element} The rendered base edge component.
 */
const BaseEdgeComponent = memo(({ edgeId, pathD }) => {
  // Get the belt speed
  const speed = useStore(s => s.speed)

  // The speed of the dash animation
  const dashSpeed = 300000 / speed

  // Render the base edge component
  return (
    <BaseEdge
      x-id={edgeId}
      path={pathD}
      className={classNames.join(' ')}
      style={{
        animation: `dashdraw ${dashSpeed}ms linear infinite`,
      }}
    />
  )
})

export default BaseEdgeComponent

const classNames = [
  'react-flow__edge-path',
  'stroke-[3rem]',
  'opacity-25',
  'transition-colors',
  'duration-500',
  'ease-in-out',
]
