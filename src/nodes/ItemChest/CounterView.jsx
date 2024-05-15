/**
 * CounterView component displays a grid of item counts in a chest.
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data containing the items to be displayed.
 * @param {Object} props.dimensions - The dimensions of the container.
 * @param {number} props.dimensions.width - The width of the container.
 * @param {number} props.dimensions.height - The height of the container.
 * @returns {JSX.Element} The rendered CounterView component.
 */
const CounterView = ({ data, dimensions: { width, height } }) => {
  // Get a handle to the getItem function from the store
  const getItem = useStore(s => s.getItem)

  // If there are no items, render an empty chest
  if (!data?.items?.length) {
    return (
      <div className="flex flex-col gap-16 items-center justify-center w-full h-full">
        <div>This chest is empty</div>
        <div className="text-3xl mb-12">📦</div>
        <AddItemButton />
      </div>
    )
  }

  // Get the items from the store
  const items = data?.items?.map(id => getItem(id))

  // Define the desired cell size
  const desiredCellSize = 90

  // Calculate the maximum number of cells that can fit in the width and height
  const maxColumns = Math.floor(width / desiredCellSize)
  const maxRows = Math.floor(height / desiredCellSize)

  // Calculate the actual cell size by dividing the width and height by the maximum number of cells
  const cellSize = Math.min(
    Math.floor(width / maxColumns),
    Math.floor(height / maxRows)
  )

  // Calculate the actual number of columns and rows
  const columns = Math.floor(width / cellSize)
  const rows = Math.floor(height / cellSize)

  // Calculate the total number of cells
  const totalCells = columns * rows

  // Calculate the number of items
  const numberOfItems = data?.items?.length || 0

  // Calculate the number of empty cells
  const emptyCells = totalCells - numberOfItems

  // Calculate the number of rows to remove
  const rowsToRemove = Math.floor(emptyCells / columns)

  // Adjust the number of rows
  const adjustedRows = rows - rowsToRemove

  // Calculate the height of new table to keep cells square
  const newHeight = adjustedRows * cellSize

  // Convert the items into buckets by type
  const buckets = items?.reduce((acc, item) => {
    const emoticon = item.emoticon || 'default'

    if (!acc[emoticon]) {
      acc[emoticon] = []
    }

    acc[emoticon].push(item)

    return acc
  }, {})

  // Render the items
  return (
    <>
      <AddItemButton />
      <div
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${adjustedRows}, 1fr)`,
          height: `${newHeight}px`,
        }}
        className="grid gap-2 p-2 place-items-center">
        {buckets &&
          Object.entries(buckets).map(([type, items]) => (
            <div
              key={type}
              className="w-20 h-20 border border-zinc-600 rounded-full grid place-items-center">
              {items?.[0]?.emoticon} × {items.length}
            </div>
          ))}
      </div>
    </>
  )
}

import { useStore } from '@xyflow/react'
import AddItemButton from './AddItemButton'

export default CounterView
