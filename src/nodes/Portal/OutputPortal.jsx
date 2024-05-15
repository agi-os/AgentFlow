import { BeltSource } from '../../components/BeltPort'
import Portal from './Portal'

/**
 * Renders an output portal component.
 * @param {string} id - The ID of the portal.
 * @param {boolean} selected - Indicates whether the portal is selected.
 * @returns {JSX.Element} The output portal component.
 */

const OutputPortal = ({ id, selected }) => (
  <Portal id={id} selected={selected}>
    <div className="flex justify-center">⛲</div>
    <BeltSource />
  </Portal>
)

export default OutputPortal
