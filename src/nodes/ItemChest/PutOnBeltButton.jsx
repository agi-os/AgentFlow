import { useStore, useNodeId } from '@xyflow/react'

import { putOnBeltClassNames } from './constants'
import onClick from './putOnBelt'
const classNames = putOnBeltClassNames

const PutOnBeltButton = () => {
  const nodeId = useNodeId()

  // Get store data
  const putOnBelt = useStore(s => s.putOnBelt)
  const setItem = useStore(s => s.setItem)
  const getLocationItems = useStore(s => s.getLocationItems)
  const edges = useStore(s => s.edges)

  // Sanity check
  if (!edges.find(e => e.source === nodeId && e.sourceHandle === 'outbox')) {
    return null
  }

  return (
    <button
      className={classNames.join(' ')}
      onClick={() =>
        onClick({ putOnBelt, getLocationItems, setItem, edges, nodeId })
      }>
      Emit 1 item
    </button>
  )
}

export default PutOnBeltButton
