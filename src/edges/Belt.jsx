import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
} from '@xyflow/react'

/**
 * CustomEdge component represents a custom edge in the React Flow graph.
 * @param {Object} props - The props for the CustomEdge component.
 * @param {string} props.id - The unique identifier for the edge.
 * @param {number} props.sourceX - The x-coordinate of the source node.
 * @param {number} props.sourceY - The y-coordinate of the source node.
 * @param {number} props.targetX - The x-coordinate of the target node.
 * @param {number} props.targetY - The y-coordinate of the target node.
 * @param {string} props.sourcePosition - The position of the source node.
 * @param {string} props.targetPosition - The position of the target node.
 * @param {Object} [props.style] - The custom style for the edge.
 * @param {string} [props.markerEnd] - The marker for the end of the edge.
 * @returns {JSX.Element} The JSX element representing the custom edge.
 */
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const classNames = ['stroke-[3rem]', 'opacity-25']

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={style}
        className={classNames.join(' ')}
        animated
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all',
          }}
          className={[
            'bg-zinc-800',
            'w-8',
            'h-8',
            'grid',
            'place-items-center',
            'rounded-full',
            'border',
            selected ? 'border-zinc-500' : 'border-zinc-700',
            'cursor-pointer',
          ].join(' ')}>
          🚥
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default CustomEdge
