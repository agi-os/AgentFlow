import { craftingSlotClassNames } from './constants'

/**
 * Renders a crafting slot component with the provided item and onClick event handler.
 *
 * @param {Object} item - The item object to be displayed in the slot.
 * @param {Function} onClick - The event handler function to be called when the slot is clicked.
 * @returns {JSX.Element} A div element representing the crafting slot.
 */
const CraftingSlot = ({ item, onClick }) => {
  return (
    <div className={craftingSlotClassNames.join(' ')} onClick={onClick}>
      {item && <div>{item.emoji}</div>}
    </div>
  )
}

export default CraftingSlot
