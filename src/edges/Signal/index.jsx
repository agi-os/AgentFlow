import { memo, useState, useEffect } from 'react'
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

    const signalEdgeLookup = useStore(s => s.signalEdgeLookup)

    // Use state to store the edge data to trigger re-renders only when it changes
    const [edgeData, setEdgeData] = useState(signalEdgeLookup.get(id) || {})

    useEffect(() => {
      // Update edgeData when the corresponding data in signalEdgeLookup changes
      setEdgeData(signalEdgeLookup.get(id) || {})
    }, [id, signalEdgeLookup])

    // Example color mapping based on signalType
    let color = 'text-zinc-700'
    if (data.signalType === signalTypes.CONFIGURATION_UPDATED) {
      color = 'text-orange-600'
    } else if (data.signalType === signalTypes.ALARM) {
      color = 'text-red-600'
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
            stroke: 'currentColor', // make path inherit from classNames
          }}
          classNames={[color, 'stroke-1']}
        />

        {/* Label rendering */}
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          stroke="none"
          fill="currentColor"
          className={[color, 'text-xs'].join(' ')}>
          {edgeData.signalType}
        </text>
      </>
    )
  }
)

export default SignalEdge
