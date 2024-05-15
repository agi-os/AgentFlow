import { useReactFlow, useStore, useNodeId } from '@xyflow/react'

const AddItemButton = () => {
  const store = useStore()
  const reactFlow = useReactFlow()
  const nodeId = useNodeId()

  return (
    <div className={buttonClassNames.join(' ')}>
      <button onClick={() => addItemHandler(store, reactFlow, nodeId)}>
        Add 10 items
      </button>
      <button onClick={() => clearItemsHandler(reactFlow, nodeId)}>
        Clear items
      </button>
    </div>
  )
}

const addItemHandler = (store, reactFlow, nodeId) => {
  // Select 10 random items from the list of items.
  const randomItemIds = store.items
    .sort(() => 0.5 - Math.random())
    .slice(0, 10)
    .map(item => item.id)

  // Get this node from the store.
  const node = reactFlow.getNode(nodeId)

  // Get current node data.
  const data = node.data || {}

  // Get the current item array.
  const items = data.items || []

  // Add the random item ids to the current item array.
  const newItems = [...items, ...randomItemIds]

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

const clearItemsHandler = (reactFlow, nodeId) => {
  // Get this node from the store.
  const node = reactFlow.getNode(nodeId)

  // Get current node data.
  const data = node.data || {}

  // Clear the items array.
  const newData = { ...data, items: [] }

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
  'flex',
  'gap-5',
  'py-1',
  'rounded-full',
  'text-zinc-300',
  'font-thin',
  'text-sm',
  'absolute',
  'bottom-3',
  'right-3',
]

export default AddItemButton
