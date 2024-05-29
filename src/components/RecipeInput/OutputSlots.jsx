import { useNodeId } from '@xyflow/react'
import Slot from './Slot'
import { outputSlotsClassNames } from './constants'
import { createItemTypes } from './utils'
import { useState } from 'react'

/**
 * Component representing output slots for a recipe.
 *
 * @param {Object} props - The props object containing slots and setRecipe function.
 * @param {Array} props.slots - An array of slots for the recipe.
 * @param {Function} props.setRecipe - A function to set the recipe based on the selected slot.
 * @returns {JSX.Element} JSX element representing the output slots with clickable slots.
 */
const OutputSlots = ({ slots, setRecipe }) => {
  const id = useNodeId()

  const [activeSlot, setActiveSlot] = useState(-1)

  const itemTypes = createItemTypes(slots)

  return (
    <div x-node-id={id} className={outputSlotsClassNames.join(' ')}>
      {itemTypes.map((itemType, index) => (
        <Slot
          key={itemType.name}
          itemType={itemType}
          onClick={() => {
            setActiveSlot(index)
            setRecipe(slots[index])
          }}
          active={index === activeSlot}
        />
      ))}
    </div>
  )
}

export default OutputSlots
