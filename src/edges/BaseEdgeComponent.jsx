import { BaseEdge, useStore } from '@xyflow/react'
import { memo } from 'react'

import {
  MIN_SPEED,
  MAX_SPEED,
  MIN_DASH_DELAY,
  MAX_DASH_DELAY,
} from '../constants/_mainConfiguration'

import { classNames } from './classNames'

/**
 * Renders a base edge component.
 * @param {Object} props - The component props.
 * @param {string} props.pathD - The path data for the edge.
 * @returns {JSX.Element} The rendered base edge component.
 */
const BaseEdgeComponent = memo(({ edgeId, pathD }) => {
  // Get the belt speed
  const speed = useStore(s => s.speed)

  // Calculate the factor for the dash animation delay
  const factor =
    Math.log(MAX_DASH_DELAY / MIN_DASH_DELAY) / Math.log(MAX_SPEED / MIN_SPEED)

  // Calculate the dash animation delay to match the movement speed
  const dashSpeed = MIN_DASH_DELAY * Math.pow(speed / MIN_SPEED, factor)

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
