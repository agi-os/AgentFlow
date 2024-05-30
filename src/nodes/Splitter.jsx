import Title from '../components/Title'

import SignalHandles from '../signals/SignalHandles'
import { BeltTarget, BeltSource } from '../components/BeltPort'
import { useStore, useNodeId } from '@xyflow/react'
import { useEffect, useState } from 'react'

/**
 * Splitter is a node that splits incoming data and immediately outputs it on different output paths.
 * @param {string} id - Node ID
 * @param {object} data - Node data
 * @returns {JSX.Element}
 */
const SplitterNode = ({ id: nodeId, selected, data }) => {
  const selectedClassNames = selected
    ? ['outline-offset-8', 'outline-2']
    : ['outline-offset-0', 'outline-0']

  const getLocationItems = useStore(s => s.getLocationItems)
  const setItemLocation = useStore(s => s.setItemLocation)
  const getNodeEdges = useStore(s => s.getNodeEdges)
  const items = useStore(s => s.items)

  // Round robin distribution logic
  const [lastEdgeIndex, setLastEdgeIndex] = useState(0)

  useEffect(() => {
    // If semaphore is red, do not emit items
    if (data?.semaphore === 'red') return

    // Get items at this node's location
    const itemsAtLocation = getLocationItems(nodeId)

    // If no items are present, do nothing
    if (itemsAtLocation.length === 0) {
      return
    }

    // Get the connected outbox edges
    const outboxEdges = getNodeEdges(nodeId).filter(
      edge => edge.source === nodeId && edge.sourceHandle.startsWith('outbox')
    )

    console.log('Splitter: Items to distribute:', itemsAtLocation)
    console.log('Splitter: Outbox edges:', outboxEdges)

    itemsAtLocation.forEach(item => {
      // Cycle to the next outbox edge
      setLastEdgeIndex(lastEdgeIndex => {
        const targetEdge = outboxEdges[lastEdgeIndex]
        if (!item || !targetEdge) return
        setItemLocation({ itemId: item.id, locationId: targetEdge.id })

        // Cycle to the next outbox edge
        return (lastEdgeIndex + 1) % 2
      })
    })
  }, [
    getLocationItems,
    getNodeEdges,
    lastEdgeIndex,
    nodeId,
    setItemLocation,
    items,
    data?.semaphore,
  ])

  return (
    <div
      x-node-id={nodeId}
      className={[...classNames, ...selectedClassNames].join(' ')}>
      <BeltTarget />
      <Title>🔀 Splitter</Title>
      <BeltSource style={{ left: '30%' }} id="outbox" />
      <BeltSource style={{ left: '70%' }} id="outbox2" />
      <SignalHandles />
    </div>
  )
}

export default SplitterNode

const classNames = [
  'rounded',
  'text-zinc-300',
  'font-thin',
  'border-[1px]',
  'transition-all',
  'transition-duration-1000',
  'outline',
  'outline-orange-900',

  'flex',
  'flex-col',
  'text-xs',
  'border',
  'border-zinc-700',
  'p-2.5',
  'text-white',
  'bg-zinc-800',
  'rounded',
  'hover:border-zinc-600',
  'gap-4',
  'w-[13.1rem]',
  'h-[3.7rem]',
]
