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

  return (
    <div
      x-id={nodeId}
      className="flex flex-col gap-2 inset-0 w-full overflow-clip max-h-96 overflow-y-auto">
      {/* Render the items */}
      {nodeItems.map(itemId => (
        <Item key={itemId} itemId={itemId} />
      ))}
    </div>
  )
}

/**
 * Render the item data
 * @param {string} itemId - The id of the item to render
 * @returns {JSX.Element} - The rendered item data
 */
const Item = ({ itemId }) => {
  // Get the item data from the store
  const itemData = useStore(state => state.itemLookup.get(itemId))

  // Render the item data
  return (
    <div className="text-xs whitespace-nowrap">{JSON.stringify(itemData)}</div>
  )
}

export default Outbox
