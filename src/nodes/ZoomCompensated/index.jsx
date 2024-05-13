import { ZoomCompensation } from './ZoomCompensation'

/**
 * Compensates for zoom level by applying a scale to its children.
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The children components to be rendered.
 * @returns {JSX.Element} The rendered ZoomCompensated component.
 */
const ZoomCompensated = ({ children }) => {
  return (
    <div className="absolute inset-0 overflow-clip">
      <ZoomCompensation>{children}</ZoomCompensation>
    </div>
  )
}

export default ZoomCompensated
