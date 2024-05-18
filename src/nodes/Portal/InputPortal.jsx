import { BeltTarget } from '../../components/BeltPort'
import Portal from './Portal'
import { useState, useEffect } from 'react'
import { useStore } from '@xyflow/react'
import useJitteryCountdown from '../../hooks/useJitteryCountdown'
import Flip from '../../components/Flip'

// Milliseconds
const TIMER = 8_000

/**
 * Renders an input portal component.
 * @param {Object} props - The component props.
 * @param {string} props.id - The ID of the portal.
 * @param {boolean} props.selected - Indicates whether the portal is selected.
 * @returns {JSX.Element} The rendered InputPortal component.
 */

const InputPortal = ({ id, selected }) => {
  // Create a countdown timer
  const { count, to } = useJitteryCountdown({ timer: TIMER })

  // Incoming item count
  const [incomingCount, setIncomingCount] = useState(0)

  // Get edges
  const edges = useStore(s => s.nodeEdgeLookup.get(id) || [])

  // Get the handle to getLocationItems function
  const getLocationItems = useStore(s => s.getLocationItems)

  // Get the handle to getNode function
  const getNode = useStore(s => s.getNode)

  // Get the handle to addItem function
  const addItem = useStore(s => s.addItem)

  // Get the handle to removeItem function
  const removeItem = useStore(s => s.removeItem)

  // Get all the inboxes connected to this portal
  const inboxEdges_ = edges.filter(edge => edge.targetHandle === 'inbox')

  const [inboxEdges, setInboxEdges] = useState(inboxEdges_)

  useEffect(() => {
    // Update incoming edges only when the content changed
    if (JSON.stringify(inboxEdges_) === JSON.stringify(inboxEdges)) return
    setInboxEdges(inboxEdges_)
  }, [inboxEdges_, inboxEdges])

  // Get ids of all edges delivering items to our inbox
  const inboxEdgeIds = inboxEdges.map(edge => edge.id)

  // Get all items incoming to our inbox
  const allIncomingItems = inboxEdgeIds
    .map(edgeId => getLocationItems(edgeId))
    .flat()

  // Get items that are close to the portal
  const incomingItems_ = allIncomingItems.filter(
    item => item?.location?.distance < 0.03
  )

  const [incomingItems, setIncomingItems] = useState(incomingItems_)

  useEffect(() => {
    // Update incoming items only when the content changed
    if (JSON.stringify(incomingItems_) === JSON.stringify(incomingItems)) return
    setIncomingItems(incomingItems_)
  }, [incomingItems_, incomingItems])

  useEffect(() => {
    // If the countdown is not zero, do nothing
    if (count > 0) return

    // If there are no incoming items waiting, do nothing
    if (incomingItems.length === 0) return

    // Log the incoming items
    console.log(
      `portal 🔗${id} received item${
        incomingItems.length > 1 ? 's' : ''
      } 📦${incomingItems.map(item => item.id).join(', 📦')} on belt${
        inboxEdges.length > 1 ? 's' : ''
      } 🛝${inboxEdges.join(', 🛝')}`
    )

    // Get all nodes that have a connection to this portal
    const connectedNodes = edges
      .map(edge => {
        const { source, target } = edge
        return source === id ? target : source
      })
      .map(nodeId => getNode(nodeId))

    // Find all output portals connected to this portal
    const outputPortals = connectedNodes.filter(
      node => node.type === 'outputPortal'
    )

    // Send clones of all incoming items to all output portals
    outputPortals.forEach(outputPortal => {
      incomingItems.forEach(item => {
        // Deep clone the item
        const newItem = JSON.parse(JSON.stringify(item))

        // Delete the id of the new item, so it gets a new id
        delete newItem.id

        // Change the location of the new item to the id of the output portal
        newItem.location.id = outputPortal.id

        // Add the new item to the store
        addItem(newItem)

        // Log the action
        console.log(
          `portal 🔗${id} cloned item 📦${item.id} to 🐣${newItem.id} in portal 🔗${outputPortal.id}`
        )
      })
    })

    // Destroy all incoming items by removing them from store
    incomingItems.forEach(item => {
      // Remove the item from the store
      removeItem(item.id)
    })
  }, [
    count,
    incomingItems,
    edges,
    getNode,
    addItem,
    removeItem,
    id,
    inboxEdges,
  ])

  useEffect(() => {
    // Count the incoming items
    setIncomingCount(incomingItems.length)
  }, [incomingItems])

  return (
    <Portal id={id} selected={selected}>
      <BeltTarget />
      <div x-id={id} className="flex justify-center">
        ♻️
      </div>
      <div
        x-id={id}
        className="w-full grid grid-cols-2 gap-1 text-[0.6rem] place-items-center">
        <div className="bg-zinc-800 shadow-inner shadow-zinc-900 rounded-lg p-2">
          {<div>📥 {incomingCount}</div>}
        </div>
        <div className="bg-zinc-800 shadow-inner shadow-zinc-900 rounded-lg p-1">
          <Flip to={to} />
        </div>
      </div>
    </Portal>
  )
}

export default InputPortal
