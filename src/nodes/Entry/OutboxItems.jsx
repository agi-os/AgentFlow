import { useNodeId, useStore } from '@xyflow/react'
import Item from '../../components/Item'
import { outboxItemsClassNames } from './constants'

const OutboxItems = () => {
  // Get the node id
  const id = useNodeId()

  // Get references to the store functions
  const locationItems = useStore(
    state => state.getLocationItems(id),
    (a, b) => a.length === b.length
  )

  return (
    <div x-node-id={id} className={outboxItemsClassNames.join(' ')}>
      {locationItems.map(item => (
        <div
          key={item.id}
          onClick={() => {
            // Put the item on the outbox belt
            // setItemLocation({ itemId: item.id, locationId: outboxEdgeId })
          }}
          className="cursor-pointer">
          <Item itemId={item.id} />
        </div>
      ))}
    </div>
  )
}

export default OutboxItems
