import Title from '../components/Title'

import SignalHandles from '../signals/SignalHandles'
import { BeltTarget, BeltSource } from '../components/BeltPort'
import { useStore, useStoreApi } from '@xyflow/react'
import { useEffect, useState } from 'react'

import getTransportBeltStore from '../stores/transportBelt'

import useSplitterState from '../stores/splitter/useSplitterState'

/**
 * Splitter is a node that splits incoming data and immediately outputs it on different output paths.
 * @param {string} id - Node ID
 * @param {object} data - Node data
 * @returns {JSX.Element}
 */
const SplitterNode = ({ id: nodeId, selected, data }) => {
  // const getLocationItems = useStore(s => s.getLocationItems)
  // const setItemLocation = useStore(s => s.setItemLocation)
  // const items = useStore(s => s.items)
  const storeApi = useStoreApi()

  // Get a handle to the getNodeEdges function from the store
  const getNodeEdges = useStore(s => s.getNodeEdges)

  // Get the connected edges
  const allNodeEdges = getNodeEdges(nodeId)

  // Filter the edges for type "transport"
  const transportBeltEdges = allNodeEdges.filter(
    edge => edge.type === 'transport'
  )

  // Get a map of the states for all transport belt edges
  const transportBeltStates = transportBeltEdges.map(({ id }) =>
    getTransportBeltStore(id, storeApi).getState()
  )

  // Get a handle to the splitter state
  const splitterState = useSplitterState(nodeId)

  // Update splitter state with transport belt data
  useEffect(() => {
    // Find the edges connected to our inbox
    const inboxEdges = transportBeltEdges.filter(edge => {
      // if we're the source, handle the source data
      if (edge.source === nodeId) {
        // check if sourceHandle starts with inbox
        return edge.sourceHandle.startsWith('inbox')
      }

      // if we're the target, handle the target data
      if (edge.target === nodeId) {
        // check if targetHandle starts with inbox
        return edge.targetHandle.startsWith('inbox')
      }
      // if we're neither the source nor the target, return false
      return false
    })

    // Find the edges connected to our outbox
    const outboxEdges = transportBeltEdges.filter(edge => {
      // if we're the source, handle the source data
      if (edge.source === nodeId) {
        // check if sourceHandle starts with outbox
        return edge.sourceHandle.startsWith('outbox')
      }

      // if we're the target, handle the target data
      if (edge.target === nodeId) {
        // check if targetHandle starts with outbox
        return edge.targetHandle.startsWith('outbox')
      }
      // if we're neither the source nor the target, return false
      return false
    })

    // Get the list of inbox edge ids
    const inboxEdgeIds = inboxEdges.map(edge => edge.id)

    // Get the list of outbox edge ids
    const outboxEdgeIds = outboxEdges.map(edge => edge.id)

    // Check if all ids in the splitterState match the inboxEdgeIds and outboxEdgeIds
    if (
      inboxEdgeIds.length === splitterState.inboxEdgeIds.length &&
      outboxEdgeIds.length === splitterState.outboxEdgeIds.length &&
      inboxEdgeIds.every(id => splitterState.inboxEdgeIds.includes(id)) &&
      outboxEdgeIds.every(id => splitterState.outboxEdgeIds.includes(id))
    ) {
      // If they match, do nothing
      return
    } else {
      // If they don't match, update the splitter state with the new ids
      splitterState.setInboxEdgeIds(inboxEdgeIds)
      splitterState.setOutboxEdgeIds(outboxEdgeIds)

      console.log('updated', splitterState.id, splitterState)
    }
  }, [transportBeltStates, splitterState])

  const selectedClassNames = selected
    ? ['outline-offset-8', 'outline-2']
    : ['outline-offset-0', 'outline-0']

  // // Round robin distribution logic
  // const [lastEdgeIndex, setLastEdgeIndex] = useState(0)

  // useEffect(() => {
  //   // If semaphore is red, do not emit items
  //   if (data?.semaphore === 'red') return

  //   // Get items at this node's location
  //   const itemsAtLocation = getLocationItems(nodeId)

  //   // If no items are present, do nothing
  //   if (itemsAtLocation.length === 0) {
  //     return
  //   }

  //   // Get the connected outbox edges
  //   const outboxEdges = getNodeEdges(nodeId).filter(
  //     edge => edge.source === nodeId && edge.sourceHandle.startsWith('outbox')
  //   )

  //   console.log('Splitter: Items to distribute:', itemsAtLocation)
  //   console.log('Splitter: Outbox edges:', outboxEdges)

  //   itemsAtLocation.forEach(item => {
  //     // Cycle to the next outbox edge
  //     setLastEdgeIndex(lastEdgeIndex => {
  //       const targetEdge = outboxEdges[lastEdgeIndex]
  //       if (!item || !targetEdge) return
  //       setItemLocation({ itemId: item.id, locationId: targetEdge.id })

  //       // Cycle to the next outbox edge
  //       return (lastEdgeIndex + 1) % 2
  //     })
  //   })
  // }, [
  //   getLocationItems,
  //   getNodeEdges,
  //   lastEdgeIndex,
  //   nodeId,
  //   setItemLocation,
  //   items,
  //   data?.semaphore,
  // ])

  return (
    <div
      x-node-id={nodeId}
      className={[...classNames, ...selectedClassNames].join(' ')}>
      <BeltTarget style={{ left: '30%' }} id="inbox" />
      <BeltTarget style={{ left: '70%' }} id="inbox2" />
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
