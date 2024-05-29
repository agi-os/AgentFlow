import { useNodeId } from '@xyflow/react'
import { slotClassNames, outlineTextShadow } from './constants'

/**
 * Renders a slot component with specified item type, onClick handler, and active state.
 *
 * @param {Object} props - The props object containing the itemType, onClick, and active properties.
 * @param {Object} props.itemType - The type of item to be rendered in the slot.
 * @param {Function} props.onClick - The click event handler for the slot.
 * @param {boolean} props.active - The flag indicating if the slot is active.
 * @returns {JSX.Element} A React element representing the slot component.
 */
const Slot = ({ itemType, onClick, active }) => {
  const nodeId = useNodeId()

  const classNames = [
    ...slotClassNames,
    active ? 'border-orange-700' : 'border-zinc-700',
  ]

  return (
    <div
      x-node-id={nodeId}
      x-item-type={itemType}
      onClick={onClick}
      className={classNames.join(' ')}>
      <div className="text-lg">{itemType.emoji}</div>
      <div
        className="absolute right-0.5 bottom-0 font-normal text-[0.5rem]"
        style={{ textShadow: outlineTextShadow }}>
        {itemType.count}
      </div>
    </div>
  )
}

export default Slot
