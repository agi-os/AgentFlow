import Title from '../../components/Title'
import SignalHandles from '../../signals/SignalHandles'
import { Belts } from '../../components/BeltPort'
import ZoomCompensated from '../ZoomCompensated/index'

import ZoomResponsiveWrapper from '../ZoomCompensated/ZoomResponsiveWrapper'
import baseClassNames from './classNames'

import ChestBody from './ChestBody'
import { useStore } from '@xyflow/react'

import Countdown from './Countdown'

import useSelectedClassNames from '../../hooks/useSelectedClassNames'
import { useState } from 'react'

/**
 * Renders a Chest node component.
 * @param {Object} props - The component props.
 * @param {string} props.id - The unique identifier of the Chest node.
 * @param {Object} props.data - The data associated with the Chest node.
 * @returns {JSX.Element} The rendered Chest node component.
 */
const ItemChestNode = ({ id }) => {
  // Get the number of items in the chest
  const itemCount = useStore(
    store => store.itemLocationLookup?.get(id)?.length || 0
  )

  // Get a handle to the setItem on store
  const setItem = useStore(s => s.setItem)

  // State to control item type list visibility
  const [showItemTypes, setShowItemTypes] = useState(false)

  // Get the selected class names
  const selectedClassNames = useSelectedClassNames()

  // Combine the base and selected class names
  const classNames = [...baseClassNames, ...selectedClassNames]

  // Get available item types
  const importedItems = window.__ITEMS__ || []
  const availableItemTypes = [...new Set(importedItems.map(item => item.type))]

  const handleAddToStore = type => {
    // Filter imported items for the type selected
    const itemsOfType = importedItems.filter(item => item.type === type)

    // Loop over all items, adding each to this chest
    for (const item of itemsOfType) {
      setItem({
        ...item,
        // Set the initial location to this chest
        location: { id },
        // Do not use original id, create a clone with a new id
        id: null,
      })
    }

    setShowItemTypes(!showItemTypes)
  }

  return (
    <div x-node-id={id} className={classNames.join(' ')}>
      <Title>📦 Item Chest ({itemCount})</Title>
      <ZoomCompensated classNames={['mt-10', 'overflow-hidden']}>
        <ZoomResponsiveWrapper>
          <ChestBody />
        </ZoomResponsiveWrapper>
      </ZoomCompensated>
      <Countdown />

      {/* Button to toggle item type list */}
      <button
        onClick={() => setShowItemTypes(!showItemTypes)}
        className="absolute bottom-4 left-4 px-2 py-1 rounded bg-zinc-700 text-white text-xs">
        Show Item Packs
      </button>

      {/* Conditionally render the item type list */}
      {showItemTypes && (
        <div className="absolute bottom-12 left-4 bg-zinc-800 text-white p-2 rounded text-xs">
          <ul>
            {availableItemTypes.map(type => (
              <li key={type}>
                <button
                  className="bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleAddToStore(type)}>
                  {type}s
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Belts />
      <SignalHandles />
    </div>
  )
}

export default ItemChestNode
