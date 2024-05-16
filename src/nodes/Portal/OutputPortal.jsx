import { useState, useEffect } from 'react'
import { BeltSource } from '../../components/BeltPort'
import Portal from './Portal'
import { useStore } from '@xyflow/react'

const TIMER = 5

/**
 * Renders an output portal component.
 * @param {string} id - The ID of the portal.
 * @param {boolean} selected - Indicates whether the portal is selected.
 * @returns {JSX.Element} The output portal component.
 */
const OutputPortal = ({ id, selected }) => {
  const [count, setCount] = useState(TIMER) // Set initial countdown value

  // Get all connections to this portal
  const edges = useStore(s => s.getNodeEdges(id))

  // Get a handle to the getLocationItems function
  const getLocationItems = useStore(s => s.getLocationItems)

  // Get a handle to the setItem function
  const setItem = useStore(s => s.setItem)

  // Find the edge connected to our outbox
  const outboxEdgeId = edges.find(edge => edge.sourceHandle === 'outbox')?.id

  // Get the count of items waiting in the inbox
  const locationItems = getLocationItems(id)

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prevCount => (prevCount > 0 ? prevCount - 1 : TIMER))
    }, 1000) // Countdown every second

    return () => clearInterval(timer) // Cleanup on unmount
  }, [])

  // Watch any incoming items and move them all to the outbox belt
  useEffect(() => {
    // If we have no outbox edge, do nothing
    if (!outboxEdgeId) return

    // If the countdown is not zero, do nothing
    if (count > 0) return

    // Get all items incoming to our inbox here, to prevent infinite loop from dependency array
    const locationItems = getLocationItems(id)

    // If we do not have any items waiting, do nothing
    if (locationItems.length === 0) return

    // Work on the received items
    locationItems.forEach(item => {
      // Only update the item if its location is not already the outbox
      if (item.location.id !== outboxEdgeId) {
        console.log(`Sending item ${item.id} to outbox ${outboxEdgeId}`)

        // Update the item location to the outbox
        const newItem = {
          ...item,
          location: {
            queue: ((Math.random() * 1000) | 0) / 1000,
            id: outboxEdgeId,
          },
        }

        // Update the item in the store
        setItem(newItem)
      }
    })
  }, [count, outboxEdgeId, setItem, getLocationItems, id])

  return (
    <Portal id={id} selected={selected}>
      <div className="flex justify-center">⛲</div>
      <div className="w-full grid grid-cols-2 gap-1 -mt-2 text-[0.6rem] place-items-center">
        <div>📥 {locationItems.length}</div>
        <div>⏱️ {count}</div>
      </div>
      <BeltSource />
    </Portal>
  )
}

export default OutputPortal
