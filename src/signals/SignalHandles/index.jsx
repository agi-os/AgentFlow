import { memo } from 'react'
import { useNodeId } from '@xyflow/react'

import Handle from './Handle'
import { cornerHandles } from './constants'

/**
 * Renders all the source and target signal handles.
 * @returns {JSX.Element} - The rendered source and target signal handles.
 */
const SignalHandles = memo(() => {
  // Get the node ID
  const id = useNodeId()

  // Render signal handles for all corners
  return (
    <div x-id={id}>
      {cornerHandles.map(mode => (
        <Handle key={mode} mode={mode} />
      ))}
    </div>
  )
})

export default SignalHandles
