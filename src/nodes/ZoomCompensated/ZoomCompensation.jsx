import { useStore } from '@xyflow/react'
import Centered from './Centered'

/**
 * Applies zoom compensation to its children.
 * @param {number} scale - The scale factor to apply to the children.
 * @param {ReactNode} children - The children elements to apply the zoom compensation to.
 * @returns {JSX.Element} - The rendered ZoomCompensation component.
 */

const ZoomCompensation = ({ children }) => {
  // Get the zoom level from the store
  const zoom = useStore(s => s.transform[2].toFixed(2))

  // Calculate the scale factor
  const scale = 1 / zoom

  // Apply the scale factor to the children
  return (
    <div className="absolute inset-0" style={{ transform: `scale(${scale})` }}>
      <Centered>{children}</Centered>
    </div>
  )
}

export default ZoomCompensation
