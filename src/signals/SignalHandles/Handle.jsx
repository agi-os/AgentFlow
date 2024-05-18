import { memo } from 'react'
import { Handle } from '@xyflow/react'

import createClassNames from './createClassNames'

/**
 * Returns a single signal handle component.
 * @param {string} mode - The mode of the handle component.
 * @returns {JSX.Element} - The handle component.
 */
const Handle_ = memo(({ mode = 'topLeft-top' } = {}) => {
  // Split the mode into corner and handle type
  const [corner, edge] = mode.split('-')

  // Create class names for the handle component
  const classNames = createClassNames({ corner, edge })

  // Return custom handle component with the specified props
  return (
    <Handle
      id={mode}
      type="signal"
      position={edge}
      className={classNames.join(' ')}
    />
  )
})

export default Handle_
