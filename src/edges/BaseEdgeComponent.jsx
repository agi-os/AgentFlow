import { BaseEdge } from '@xyflow/react'
import { memo } from 'react'

/**
 * Renders a base edge component.
 * @param {Object} props - The component props.
 * @param {string} props.pathD - The path data for the edge.
 * @param {string} props.markerEnd - The marker end for the edge.
 * @param {number} props.dashSpeed - The speed of the dash animation.
 * @returns {JSX.Element} The rendered base edge component.
 */
const BaseEdgeComponent = memo(({ edgeId, pathD, markerEnd, dashSpeed }) => {
  return (
    <BaseEdge
      x-id={edgeId}
      path={pathD}
      markerEnd={markerEnd}
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
