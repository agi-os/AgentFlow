import { memo } from 'react'
import { getBezierPath, useStore } from '@xyflow/react'
import BaseEdgeComponent from '../BaseEdgeComponent'
import signalTypes from '../../constants/signalTypes'

const SignalEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data = {},
  }) => {
    const speed = useStore(s => s.speed)

    // Example color mapping based on signalType
    let color = 'stroke-zinc-700'
    if (data.signalType === signalTypes.CONFIGURATION_UPDATED) {
      color = 'stroke-orange-600'
    } else if (data.signalType === signalTypes.ALARM) {
      color = 'stroke-red-600'
    }

    // Get the path data
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    })

    // Calculate animation speed based on system speed
    const animationSpeed = (1000 / Math.sqrt(speed)) * 50

    return (
      <>
        <BaseEdgeComponent
          edgeId={id}
          pathD={edgePath}
          style={{
            animation: `signalPulse ${animationSpeed}ms linear infinite`,
          }}
          classNames={[color, 'stroke-1']}
        />

        {/* Optional label rendering for signalType */}
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          fill={color}>
          {data.signalType}
        </text>
      </>
    )
  }
)

export default SignalEdge
