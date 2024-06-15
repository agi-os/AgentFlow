import { useNodeId, useStore } from '@xyflow/react'

/**
 * Renders an outbox with a list of items.
 * @returns {JSX.Element} - A button element to trigger LLM call if enabled, or a message if disabled.
 */
const Outbox = () => {
  // Get the node id
  const nodeId = useNodeId()

  // Get the items from the node data
  const nodeItems = useStore(state => state.itemLocationLookup.get(nodeId))

  // Get itemLookup function
  const itemLookup = useStore(state => state.itemLookup)

  // Group the items by their type
  const groupedItems =
    nodeItems?.reduce((acc, itemId) => {
      const itemData = itemLookup.get(itemId)
      const itemType = itemData?.type
      if (!acc[itemType]) {
        acc[itemType] = []
      }
      acc[itemType].push(itemId)
      return acc
    }, {}) || {}

  // Largest stack in a group can be 50 items, stack the groups
  const stackedItems = Object.values(groupedItems).reduce((acc, group) => {
    // Split the group into stacks of 50 items
    const stacks = group.reduce((acc, itemId, index) => {
      if (index % 50 === 0) {
        acc.push([])
      }
      acc[acc.length - 1].push(itemId)
      return acc
    }, [])
    return [...acc, ...stacks]
  }, [])

  // Define the grid size in x and y directions for all stacks
  const gridSizeX = 8
  const gridSizeY = 3

  // Calculating the total number of cells needed
  const gridSize = gridSizeX * gridSizeY

  // Calculate the number of cells needed based on the total item stacks
  const numCells = Math.ceil(stackedItems.length / gridSize)

  // Create a gridData array to hold items for each cell
  const gridData = Array(numCells)
    .fill(null)
    .map(() => Array(gridSize).fill(null))

  // Distribute the item stacks into the gridData array
  stackedItems.forEach((stack, index) => {
    const cellIndex = Math.floor(index / gridSize)
    const slotIndex = index % gridSize
    gridData[cellIndex][slotIndex] = stack
  })

  console.log('stacks', stackedItems)

  return (
    <div x-id={nodeId} className="p-1 grid grid-cols-8 gap-0">
      {gridData.map((rowData, rowIndex) =>
        rowData.map((stack, colIndex) => (
          <Cell key={colIndex} items={stack || []} />
        ))
      )}
    </div>
  )
}

const Cell = ({ items }) => {
  const allItemsCount = Math.max(items.length, 0)

  // Get itemLookup function
  const itemLookup = useStore(state => state.itemLookup)

  return (
    <div className="w-16 h-16 relative shadow-[inset_0_1px_2px_0_#222] rounded-sm">
      {items.length === 0 ? (
        <div className="absolute w-8 h-8 border border-zinc-600 bg-zinc-700 rounded-sm opacity-25 shadow-sm shadow-zinc-900 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      ) : (
        <div
          title={itemLookup.get(items[0])?.type}
          className="inset-2 bg-zinc-800 border border-zinc-700 rounded shadow-sm shadow-zinc-900 absolute grid place-items-center">
          {items.slice(0, 1).map(itemId => (
            <Item key={itemId} itemId={itemId} />
          ))}
          <div
            className="absolute bottom-0.5 text-zinc-400 right-1 text-xs font-semibold"
            style={{
              filter:
                'drop-shadow(0px 0px 0.1px #000) drop-shadow(0px 0px 0.1px #000) drop-shadow(0px 0px 0.1px #000) drop-shadow(0px 0px 0.1px #000)',
            }}>
            {allItemsCount}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Render the item data
 * @param {string} itemId - The id of the item to render
 * @returns {JSX.Element} - The rendered item data
 */
const Item = ({ itemId }) => {
  const itemData = useStore(state => state.itemLookup.get(itemId))

  return (
    <div
      style={{
        filter:
          'drop-shadow(0.2px 0.9px 0.4px #000A) drop-shadow(-0.2px 0.9px 0.4px #000A)',
      }}
      className="rounded px-2 py-1 mb-1 text-2xl">
      {itemData.emoji}
    </div>
  )
}

export default Outbox
