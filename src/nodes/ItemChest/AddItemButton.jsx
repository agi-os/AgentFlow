import { useReactFlow, useStore, useNodeId } from '@xyflow/react'

const AddItemButton = () => {
  const store = useStore()
  const reactFlow = useReactFlow()
  const nodeId = useNodeId()

  return (
    <button
      className={buttonClassNames.join(' ')}
      onClick={() => addItemHandler(store, reactFlow, nodeId)}>
      Add 10 items
    </button>
  )
}

const addItemHandler = (store, reactFlow, nodeId) => {
  // Select 10 random items from the list of items.
  const randomItems = store.items.sort(() => 0.5 - Math.random()).slice(0, 10)

  // Get this node from the store.
  const node = reactFlow.getNode(nodeId)

  // Get current node data.
  const data = node.data || {}

  // Get the current items.
  const items = data.items || []

  // Add the random items to the current items.
  const newItems = [...items, ...randomItems]

  // Update the node data with the new items.
  const newData = { ...data, items: newItems }

  // Update the node with the new data.
  const newNode = { ...node, data: newData }

  // Update the node in the store.
  reactFlow.setNodes([
    ...reactFlow.getNodes().filter(n => n.id !== nodeId),
    newNode,
  ])
}

const buttonClassNames = [
  'px-2',
  'py-1',
  'rounded-full',
  'text-zinc-300',
  'font-thin',
  'bg-zinc-800',
  'border-[1px]',
  'border-zinc-700',
]

export default AddItemButton
