import { BeltTarget } from '../../components/BeltPort'
import Portal from './Portal'
import { useState, useEffect } from 'react'
import { useStore } from '@xyflow/react'

const TIMER = 10

/**
 * Renders an input portal component.
 * @param {Object} props - The component props.
 * @param {string} props.id - The ID of the portal.
 * @param {boolean} props.selected - Indicates whether the portal is selected.
 * @returns {JSX.Element} The rendered InputPortal component.
 */

const InputPortal = ({ id, selected }) => {
  const [count, setCount] = useState(TIMER) // Set initial countdown value

  // Get all edges connected to this portal
  const edges = useStore(s => s.getNodeEdges(id))

  // Get the handle to getLocationItems function
  const getLocationItems = useStore(s => s.getLocationItems)

  // Get the handle to getNode function
  const getNode = useStore(s => s.getNode)

  // Get the handle to addItem function
  const addItem = useStore(s => s.addItem)

  // Get the handle to removeItem function
  const removeItem = useStore(s => s.removeItem)

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prevCount => (prevCount > 0 ? prevCount - 1 : TIMER))
    }, 1000) // Countdown every second

    return () => clearInterval(timer) // Cleanup on unmount
  }, [])

  useEffect(() => {
    // If the countdown is not zero, do nothing
    if (count > 0) return

    // If there are no edges connected to this portal, do nothing
    if (edges.length === 0) return

    // Get ids of all edges delivering items to our inbox
    const inboxEdges = edges
      .filter(edge => edge.targetHandle === 'inbox')
      .map(edge => edge.id)
      .filter(Boolean)

    // If there are no edges delivering items to our inbox, do nothing
    if (inboxEdges.length === 0) return

    // Get all items incoming to our inbox
    const incomingItems = inboxEdges
      .map(edgeId => getLocationItems(edgeId))
      .flat()
      .filter(Boolean)

    // If there are no incoming items, do nothing
    if (!incomingItems || incomingItems.length === 0) return

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

    // Log the action
    console.log(
      `portal 🔗${id} recycled item${
        incomingItems.length > 1 ? 's' : ''
      } ♻️${incomingItems.map(item => item.id).join(', ♻️')}`
    )

    // Destroy all incoming items by removing them from store
    incomingItems.forEach(item => {
      // Remove the item from the store
      removeItem(item.id)
    })
  }, [count, id, edges, getLocationItems, getNode, addItem, removeItem])

  return (
    <Portal id={id} selected={selected}>
      <BeltTarget />
      <div className="inset-0 grid align-center justify-center">
        <div className="text-center text-xs leading-0 pt-1 -mb-2">
          ⏱️ {count}
        </div>
        <div className="text-center">🕳️</div>
      </div>
    </Portal>
  )
}

export default InputPortal
