import { ZoomCompensation } from './ZoomCompensation'

/**
 * Compensates for zoom level by applying a scale to its children.
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The children components to be rendered.
 * @returns {JSX.Element} The rendered ZoomCompensated component.
 */
const ZoomCompensated = ({ classNames = [], children }) => {
  const allClassNames = ['absolute', 'inset-0', ...classNames]
  return (
    <div className={allClassNames.join(' ')}>
      <ZoomCompensation>{children}</ZoomCompensation>
    </div>
  )
}

export default ZoomCompensated
