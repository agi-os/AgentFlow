import { useStore, useNodeId } from '@xyflow/react'

const PutOnBeltButton = () => {
  const nodeId = useNodeId()

  // Get store data
  const setItem = useStore(s => s.setItem)
  const getLocationItemsSorted = useStore(s => s.getLocationItemsSorted)
  const edges = useStore(s => s.edges)

  return (
    <button
      className={buttonClassNames.join(' ')}
      onClick={() =>
        onClick({ getLocationItemsSorted, setItem, edges, nodeId })
      }>
      Emit a single item on output belt
    </button>
  )
}

const onClick = ({ getLocationItemsSorted, setItem, edges, nodeId }) => {
  // Get the next item from queue
  const nextItem = getLocationItemsSorted(nodeId)[0]

  // Get the id of the edge on outbox of this node
  const edgeId = edges.find(
    e => e.sourceHandle === 'outbox' && e.source === nodeId
  ).id

  // Update the location of the item to the output belt
  const updatedItem = {
    ...nextItem,
    location: { ...nextItem.location, id: edgeId },
  }

  // Add the updated item to the store
  setItem(updatedItem)

  // Wait for debounce to recalculate the item location map
  setTimeout(() => {
    // Distribute the queue distances on the output belt to justify the items evenly
    const allItems = getLocationItemsSorted(edgeId)

    // Calculate the optimal distance between items, adding start and end 1/2 distance
    const distance = 1 / (allItems.length + 1)

    // Update the items on the output belt
    allItems.forEach((item, index) => {
      const updatedItem = {
        ...item,
        location: {
          ...item.location,
          distance: Math.floor(100 * distance * (index + 1)) / 100,
        },
      }

      // Update the item in the store
      setItem(updatedItem)
    })
  }, 200)
}

const buttonClassNames = [
  'px-2',
  'border',
  'border-zinc-700',
  'text-zinc-500',
  'bg-zinc-800',
  'outline',
  'outline-4',
  'outline-zinc-800',
  'hover:bg-zinc-700',
  'hover:text-white',
  'flex',
  'gap-5',
  'py-1',
  'rounded-full',
  'font-thin',
  'text-sm',
  'absolute',
  'bottom-3',
  'right-3',
]

export default PutOnBeltButton
