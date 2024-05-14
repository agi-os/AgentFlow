import usePathAnimation from '../hooks/usePathAnimation'

import { BaseEdge, getBezierPath } from '@xyflow/react'

/**
 * Animated component represents an animated edge in a flow diagram.
 *
 * @param {Object} props - The props for the Animated component.
 * @param {number} props.sourceX - The x-coordinate of the source point.
 * @param {number} props.sourceY - The y-coordinate of the source point.
 * @param {number} props.targetX - The x-coordinate of the target point.
 * @param {number} props.targetY - The y-coordinate of the target point.
 * @param {string} props.sourcePosition - The position of the source point relative to the source node.
 * @param {string} props.targetPosition - The position of the target point relative to the target node.
 * @param {string} props.markerEnd - The marker to be placed at the end of the edge.
 * @param {string} props.markerStart - The marker to be placed at the start of the edge.
 * @returns {JSX.Element} The rendered Animated component.
 */
const Animated = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  markerStart,
}) => {
  const { pathRef, divRef, pathD } = usePathAnimation(
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition
  )
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        className={classNames.join(' ')}
        animated
      />

      <path
        style={{ fill: 'none', stroke: 'none' }}
        d={pathD}
        markerEnd={markerEnd}
        markerStart={markerStart}
        ref={pathRef}
      />

      <foreignObject x={0} y={0} width="1" height="1" overflow="visible">
        <div
          ref={divRef}
          xmlns="http://www.w3.org/1999/xhtml"
          className="w-10 h-10 -m-5 rounded-full border border-px border-zinc-600 bg-zinc-800 grid place-items-center"
          style={{
            transition: '0.1s linear',
          }}>
          🚀
        </div>
      </foreignObject>
    </>
  )
}

const classNames = ['react-flow__edge-path', 'stroke-[3rem]', 'opacity-25']

export default Animated
