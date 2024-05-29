import { useNodeId } from '@xyflow/react'
import { recipeInputGridClassNames } from './constants'
import CraftingSlot from './CraftingSlot'

/**
 * Renders a grid of crafting slots based on the provided crafting grid data.
 * Allows users to interact with the crafting slots by selecting items from an inbox.
 *
 * @param {number} cols - The number of columns in the crafting grid.
 * @param {number} rows - The number of rows in the crafting grid.
 * @param {Array} craftingGrid - The array representing the crafting grid with items.
 * @param {Function} setCraftingGrid - A function to update the crafting grid data.
 * @param {Object} selectedInboxItem - The currently selected item from the inbox.
 * @returns {JSX.Element} A JSX element representing the crafting slots grid.
 */
const CraftingSlots = ({
  cols,
  rows,
  craftingGrid,
  setCraftingGrid,
  selectedInboxItem,
}) => {
  const nodeId = useNodeId()

  return (
    <div x-node-id={nodeId}>
      <div className={`${recipeInputGridClassNames.join(' ')} ${cols} ${rows}`}>
        {craftingGrid.map((item, index) => (
          <CraftingSlot
            key={index}
            item={item}
            index={index}
            onClick={() => {
              setCraftingGrid(gridDraft => {
                //Sanity check
                if (!selectedInboxItem) return gridDraft

                // Get the item type
                const { type, emoji } = selectedInboxItem

                // Get old value
                const oldValue = gridDraft[index]

                // If we do not have an old value, we set the new value
                if (!oldValue) {
                  gridDraft[index] = { type, emoji }
                } else {
                  // We have an old value, check if we should remove it or change it
                  if (oldValue.type === type) {
                    // Old value is the same as new, reset it to empty
                    gridDraft[index] = null
                  } else {
                    // Set the value to new value
                    gridDraft[index] = { type, emoji }
                  }
                }

                // Return a shallow copy to cause a repaint
                return [...gridDraft]
              })
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default CraftingSlots
