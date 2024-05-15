import { BaseEdge } from '@xyflow/react'
import { memo } from 'react'

/**
 * Renders a base edge component.
 * @param {Object} props - The component props.
 * @param {string} props.pathD - The path data for the edge.
 * @param {string} props.markerEnd - The marker end for the edge.
 * @param {string[]} props.baseEdgeClassNames - The class names for the edge.
 * @param {number} props.dashSpeed - The speed of the dash animation.
 * @returns {JSX.Element} The rendered base edge component.
 */
const BaseEdgeComponent = memo(
  ({ pathD, markerEnd, baseEdgeClassNames, dashSpeed }) => {
    return (
      <BaseEdge
        path={pathD}
        markerEnd={markerEnd}
        className={baseEdgeClassNames.join(' ')}
        style={{
          animation: `dashdraw ${dashSpeed}ms linear infinite`,
        }}
      />
    )
  }
)

export default BaseEdgeComponent
