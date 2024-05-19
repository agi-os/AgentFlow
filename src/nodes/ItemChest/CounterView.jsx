import AddItemButton from './AddItemButton'
import EmptyChest from './EmptyChest'
import useNodeItems from '../../hooks/useNodeItems'
import PutOnBeltButton from './PutOnBeltButton'

/**
 * CounterView component displays a grid of item counts in a chest.
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data containing the items to be displayed.
 * @param {Object} props.dimensions - The dimensions of the container.
 * @param {number} props.dimensions.width - The width of the container.
 * @param {number} props.dimensions.height - The height of the container.
 * @returns {JSX.Element} The rendered CounterView component.
 */
const CounterView = ({ dimensions: { width, height } }) => {
  // Get all items at this location
  const items = useNodeItems()

  // If there are no items, render an empty chest
  if (items.length === 0) {
    return <EmptyChest />
  }

  // Define the desired cell size
  const desiredCellSize = 40

  // Calculate the maximum number of cells that can fit in the width and height
  const maxColumns = Math.floor(width / desiredCellSize)
  const maxRows = Math.floor(height / desiredCellSize)

  // Calculate the actual cell size by dividing the width and height by the maximum number of cells
  const cellSize = Math.min(
    Math.floor(width / maxColumns),
    Math.floor(height / maxRows)
  )

  // Calculate the actual number of columns and rows
  const columns = Math.floor(width / cellSize) - 5
  const rows = Math.floor(height / cellSize)

  // Calculate the total number of cells
  const totalCells = columns * rows

  // Calculate the number of items
  const numberOfItems = items.length

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
    if (!item) return acc

    const emoticon = item?.emoticon || 'default'

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
      <PutOnBeltButton />
      <div
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${adjustedRows}, 1fr)`,
          height: `${newHeight}px`,
        }}
        className="grid gap-2 p-3 place-items-center">
        {items.map(
          item =>
            item && (
              <div
                key={item.id}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                }}
                className="rounded-full grid place-items-center shadow-inner shadow-zinc-700">
                {item.emoticon}
              </div>
            )
        )}
      </div>
      <div className="absolute bottom-10 flex justify-center gap-2 p-3">
        {buckets &&
          Object.entries(buckets).map(([type, items]) => (
            <div
              key={type}
              className="w-14 h-14 border border-zinc-600 outline outline-zinc-800 outline-4 rounded-full grid place-items-center bg-zinc-800">
              <div className="text-xs leading-none -mb-4">{items.length}</div>
              <div>{items?.[0]?.emoticon}</div>
            </div>
          ))}
      </div>
    </>
  )
}

export default CounterView
