// import CounterView from './CounterView'
// import CompactView from './CompactView'
import Item from '../../components/Item'
import { useNodeId, useStore } from '@xyflow/react'
import EmptyChest from './EmptyChest'

/**
 * Renders the body of the chest component.
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data object containing items.
 * @param {Object} props.dimensions - The dimensions object containing width and height.
 * @returns {JSX.Element} The rendered component.
 */
const ChestBody = ({ dimensions }) => {
  // Get the id of the node
  const id = useNodeId()

  // Get ids of items in the location
  const itemIds = useStore(state =>
    state.getLocationItems(id).map(item => item.id)
  )

  // Get dimensions provided by the parent zoom responsive wrapper
  const { width, height } = dimensions

  // Calculate the zoom factor based on the width and height and item count, to make items fill the chest viewport
  const itemCount = itemIds.length

  // If there are no items, render an empty chest
  if (itemCount === 0) {
    return <EmptyChest dimensions={dimensions} />
  }

  // Calculate the zoom factor to use from item area
  const availableSpace = width * height
  const itemSpace = 210 * 210 * itemCount
  const zoomFactor = Math.sqrt(availableSpace / itemSpace)

  // Prepare the zoom level to make items fit the chest viewport
  const style = {
    transform: `scale(${zoomFactor})`,
    transformOrigin: 'top left',
    width: `${width / zoomFactor}px`,
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 p-2" style={style}>
      {itemIds.map(itemId => (
        <Item key={itemId} itemId={itemId} />
      ))}
    </div>
  )
}

export default ChestBody
