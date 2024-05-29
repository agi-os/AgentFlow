import { useNodeId, useStore } from '@xyflow/react'
import Slot from './Slot'
import { inboxSlotsClassNames } from './constants'
import { createItemTypes } from './utils'
import { useState } from 'react'

/**
 * InboxSlots component renders a list of slots based on the items retrieved from the store for a specific location.
 * Each slot represents a different item type, and clicking on a slot activates it and triggers a callback function.
 *
 * @param {Function} onClick - Callback function to be executed when a slot is clicked, passing the clicked item as an argument.
 * @returns {JSX.Element} React component that displays a list of slots with different item types.
 */
const InboxSlots = ({ onClick }) => {
  const nodeId = useNodeId()

  const items = useStore(s => s.getLocationItems(nodeId))

  const itemTypes = createItemTypes(items)

  const [activeSlot, setActiveSlot] = useState(-1)

  return (
    <div x-node-id={nodeId}>
      <div className={inboxSlotsClassNames.join(' ')}>
        {itemTypes.map((itemType, index) => (
          <Slot
            key={itemType.name}
            itemType={itemType}
            onClick={() => {
              // Activate the type
              setActiveSlot(index)

              // Find items of type
              const itemOfType = items.find(item => item.type === itemType.name)

              // Return the first item of this type on click
              onClick(itemOfType)
            }}
            active={index === activeSlot}
          />
        ))}
      </div>
    </div>
  )
}

export default InboxSlots
