import { Handle, Position } from '@xyflow/react'

/**
 * Renders the signal handles for a source or target signal.
 * @param {string} type - The type of signal handle ('source' or 'target').
 * @param {string} position - The position of the signal handle ('left' or 'right').
 * @returns {JSX.Element} - The rendered signal handles.
 */
const Handles = ({ type = 'source', position = 'right' }) => {
  // Check if the position is on the right side.
  const isRight = position === 'right'

  // Set the position based on the type.
  const handlePosition = isRight ? Position.Right : Position.Left

  // Prepare the class name based on the type.
  const topTopOffset = isRight ? 'left-auto right-[-0.25rem]' : 'left-3'
  const topEdgeOffset = isRight ? 'left-auto right-0' : 'left-0'
  const bottomEdgeOffset = isRight ? 'left-auto right-0' : 'left-0'
  const bottomBottomOffset = isRight ? 'left-auto right-[-0.25rem]' : 'left-3'

  // Prepare the common class names for the signal handles.
  const classNames = [
    'shadow',
    'signal-handle',
    'border-none',
    '!min-w-0',
    '!min-h-0',
    'border-0',
    'bg-zinc-700',
    'rounded',
  ]

  // Top and bottom corners need to have 2 connections each.

  // Prepare the class names for each signal handle.
  const topTopClassNames = [
    ...classNames,
    'w-[1rem]',
    'h-1',
    'top-0',
    topTopOffset,
  ]

  const topEdgeClassNames = [
    ...classNames,
    'top-3',
    'h-[1rem]',
    'w-1',
    topEdgeOffset,
  ]

  const bottomEdgeClassNames = [
    ...classNames,
    'top-auto',
    'bottom-0',
    'h-[1rem]',
    'w-1',
    'rounded',
    bottomEdgeOffset,
  ]

  const bottomBottomClassNames = [
    ...classNames,
    'top-auto',
    'bottom-0',
    'w-[1rem]',
    'h-1',
    bottomBottomOffset,
  ]

  // Prepare data for the top and bottom signal
  const topTopId = isRight ? 'rt' : 'lt'
  const topEdgeId = isRight ? 'rte' : 'lte'
  const bottomEdgeId = isRight ? 'rbe' : 'lbe'
  const bottomBottomId = isRight ? 'rb' : 'lb'

  // Return the rendered signal handles.
  return (
    <>
      <Handle
        key={topTopId}
        id={topTopId}
        type={type}
        className={topTopClassNames.join(' ')}
        position={Position.Top}
      />
      <Handle
        key={topEdgeId}
        id={topEdgeId}
        type={type}
        className={topEdgeClassNames.join(' ')}
        position={handlePosition}
      />
      <Handle
        key={bottomEdgeId}
        id={bottomEdgeId}
        type={type}
        className={bottomEdgeClassNames.join(' ')}
        position={handlePosition}
      />
      <Handle
        key={bottomBottomId}
        id={bottomBottomId}
        type={type}
        className={bottomBottomClassNames.join(' ')}
        position={Position.Bottom}
      />
    </>
  )
}

/**
 * Renders the signal handles for a source signal.
 * @returns {JSX.Element} - The rendered source signal handles.
 */
export const SourceSignalHandles = () => (
  <>
    <Handles key="a" />
    <Handles key="b" type="target" />
  </>
)

/**
 * Renders the signal handles for a target signal.
 * @returns {JSX.Element} - The rendered target signal handles.
 */
export const TargetSignalHandles = () => (
  <>
    <Handles key="a" position={Position.Left} />
    <Handles key="b" type="target" position={Position.Left} />
  </>
)

/**
 * Renders both the source and target signal handles.
 * @returns {JSX.Element} - The rendered source and target signal handles.
 */
export const SignalHandles = () => (
  <>
    <SourceSignalHandles />
    <TargetSignalHandles />
  </>
)

export default SignalHandles
