import SignalHandles from '../../signals/SignalHandles/index'
import Semaphore from '../../components/Semaphore'
import baseClassNames from '../classNames'

/**
 * Portal node is a pair of nodes that are connected by a portal, instantly transporting items between them.
 * Any item ingested by the Input Portal will disappear and reappear at the Output Portal.
 * @param {object} props - The properties of the portal.
 * @param {string} props.id - The ID of the portal.
 * @param {boolean} props.selected - Indicates whether the portal is selected.
 * @param {ReactNode} props.children - The child elements of the portal.
 * @returns {JSX.Element} The rendered portal component.
 */
const Portal = ({ id, selected, children }) => {
  // Prepare the class names based on the selected state
  const selectedClassNames = selected
    ? ['outline-offset-8', 'outline-2']
    : ['outline-offset-0', 'outline-0']

  // Combine the base and selected class names
  const classNames = [...baseClassNames, ...selectedClassNames, 'w-32', 'h-24']

  // Render the portal
  return (
    <div x-node-id={id} className={classNames.join(' ')}>
      <SignalHandles />
      <Semaphore />
      {children}
    </div>
  )
}

export default Portal
