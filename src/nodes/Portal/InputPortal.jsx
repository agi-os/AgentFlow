import { BeltTarget } from '../../components/BeltPort'
import Portal from './Portal'

/**
 * Renders an input portal component.
 * @param {Object} props - The component props.
 * @param {string} props.id - The ID of the portal.
 * @param {boolean} props.selected - Indicates whether the portal is selected.
 * @returns {JSX.Element} The rendered InputPortal component.
 */

const InputPortal = ({ id, selected }) => (
  <Portal id={id} selected={selected}>
    <BeltTarget />
    <div className="flex justify-center">🕳️</div>
  </Portal>
)

export default InputPortal
