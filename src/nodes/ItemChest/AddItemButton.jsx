import { useReactFlow, useStore, useNodeId } from '@xyflow/react'

const AddItemButton = () => {
  const store = useStore()
  const reactFlow = useReactFlow()
  const nodeId = useNodeId()

  return (
    <button
      className={buttonClassNames.join(' ')}
      onClick={() => addItemHandler(store, reactFlow, nodeId)}>
      Move 10 random items here
    </button>
  )
}

const addItemHandler = (store, reactFlow, nodeId) => {
  // Select 10 random items from the list of items which od not have same location as the node
  const randomItems = store.items
    .filter(item => item.location.id !== nodeId)
    .sort(() => 0.5 - Math.random())
    .slice(0, 10)

  // Update the location of the items to this node id
  const updatedItems = randomItems.map(item => ({
    ...item,
    location: { ...item.location, id: nodeId },
  }))

  // Add the updated items to the store
  updatedItems.forEach(item => store.setItem(item))
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

export default AddItemButton
