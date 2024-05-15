import Title from '../../components/Title'
import SignalHandles from '../../signals/handle'
import { BeltSource, BeltTarget } from '../../components/BeltPort'
import Semaphore from '../../components/Semaphore'

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
    ? ['outline-orange-700']
    : ['outline-transparent']

  // Combine the base and selected class names
  const classNames = [...baseClassNames, ...selectedClassNames]

  // Render the portal
  return (
    <div className={classNames.join(' ')}>
      <Title id={id}>🔗 Portal</Title>
      <SignalHandles />
      <Semaphore />
      {children}
    </div>
  )
}

/**
 * Renders an input portal component.
 * @param {Object} props - The component props.
 * @param {string} props.id - The ID of the portal.
 * @param {boolean} props.selected - Indicates whether the portal is selected.
 * @returns {JSX.Element} The rendered InputPortal component.
 */
export const InputPortal = ({ id, selected }) => (
  <Portal id={id} selected={selected}>
    <BeltTarget />
    <div className="flex justify-center">⤴️</div>
  </Portal>
)

/**
 * Renders an output portal component.
 * @param {string} id - The ID of the portal.
 * @param {boolean} selected - Indicates whether the portal is selected.
 * @returns {JSX.Element} The output portal component.
 */
export const OutputPortal = ({ id, selected }) => (
  <Portal id={id} selected={selected}>
    <div className="flex justify-center">⤵️</div>
    <BeltSource />
  </Portal>
)

const baseClassNames = [
  'p-1',
  'rounded',
  'text-zinc-300',
  'font-thin',
  'w-28',
  'h-16',
  'border-[1px]',
  'overflow-hidden',
  'transition-all',
  'bg-zinc-800',
  'border-zinc-700',
  'outline-1',
  'outline',
  'outline-offset-8',
]
