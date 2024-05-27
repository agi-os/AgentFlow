import { useNodeId, useStore } from '@xyflow/react'
import Item from '../../components/Item'
import { outboxItemsClassNames } from './constants'

const OutboxItems = () => {
  // Get the node id
  const id = useNodeId()

  // Get references to the store functions
  const getLocationItems = useStore(state => state.getLocationItems)
  const setItemLocation = useStore(state => state.setItemLocation)
  const getNodeEdges = useStore(state => state.getNodeEdges)

  // Get the items at this location
  const items = getLocationItems(id)

  // Get edges at this node
  const edges = getNodeEdges(id)

  // Get the id of the outbox edge
  const outboxEdgeId = edges.find(edge => edge.sourceHandle === 'outbox')?.id

  return (
    items.length > 0 && (
      <div className={outboxItemsClassNames.join(' ')}>
        {items.map(item => (
          <div
            key={item.id}
            onClick={() =>
              // Put the item on the outbox belt
              setItemLocation({ itemId: item.id, locationId: outboxEdgeId })
            }
            className="cursor-pointer">
            <Item itemId={item.id} />
          </div>
        ))}
      </div>
    )
  )
}

export default OutboxItems
