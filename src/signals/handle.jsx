import { Handle, Position } from '@xyflow/react'

/**
 * Renders the signal handles for a source or target signal.
 * @param {string} type - The type of signal handle ('source' or 'target').
 * @param {Position} position - The position of the signal handle.
 * @returns {JSX.Element} - The rendered signal handles.
 */
const Handles = ({ type = 'source', position = Position.Right }) => {
  return (
    <>
      <Handle
        key="green"
        id="green"
        type={type}
        className="signal-handle top-3 bg-green-500"
        position={position}
      />
      <Handle
        key="blue"
        id="blue"
        type={type}
        className="signal-handle top-6 bg-blue-500"
        position={position}
      />
    </>
  )
}

/**
 * Renders the signal handles for a source signal.
 * @returns {JSX.Element} - The rendered source signal handles.
 */
export const SourceSignalHandles = () => <Handles />

/**
 * Renders the signal handles for a target signal.
 * @returns {JSX.Element} - The rendered target signal handles.
 */
export const TargetSignalHandles = () => (
  <Handles type="target" position={Position.Left} />
)

/**
 * Renders both the source and target signal handles.
 * @returns {JSX.Element} - The rendered source and target signal handles.
 */
const SignalHandles = () => (
  <>
    <SourceSignalHandles />
    <TargetSignalHandles />
  </>
)

export default SignalHandles
