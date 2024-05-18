import { useState, useEffect } from 'react'
import { BeltSource } from '../../components/BeltPort'
import Portal from './Portal'
import { useStore } from '@xyflow/react'
import useJitteryCountdown from '../../hooks/useJitteryCountdown'
import Flip from '../../components/Flip'

// Milliseconds
const TIMER = 7_000

/**
 * Renders an output portal component.
 * @param {string} id - The ID of the portal.
 * @param {boolean} selected - Indicates whether the portal is selected.
 * @returns {JSX.Element} The output portal component.
 */
const OutputPortal = ({ id, selected }) => {
  // Create a countdown timer
  const { count } = useJitteryCountdown({ timer: TIMER })

  // Release happens when counter dips below zero
  const releaseEnabled = count <= 0

  // Initialize the timestamp to release the items
  const [toTime, setToTime] = useState(0)

  // Update the timestamp to release the items
  useEffect(() => {
    if (count <= 0) {
      setToTime(new Date().getTime() + 24 * 3600 * 1000 + TIMER)
    }
  }, [count])

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

  // Watch any incoming items and move them all to the outbox belt
  useEffect(() => {
    // If release is not enabled, do nothing
    if (!releaseEnabled) return

    // If we have no outbox edge, do nothing
    if (!outboxEdgeId) return

    // Get all items incoming to our inbox here, to prevent infinite loop from dependency array
    const locationItems = getLocationItems(id)

    // If we do not have any items waiting, do nothing
    if (locationItems.length === 0) return

    // Work on the received items
    locationItems.forEach(item => {
      // Only update the item if its location is not already the outbox
      if (item.location.id !== outboxEdgeId) {
        console.log(
          `portal 🔗${id} released item 📦${item.id} on belt 🛝${outboxEdgeId}`
        )

        // Update the item location to the outbox
        const newItem = {
          ...item,
          location: {
            queue: 0 + Math.random() * 0.1,
            id: outboxEdgeId,
          },
        }

        // Update the item in the store
        setItem(newItem)
      }
    })
  }, [releaseEnabled, outboxEdgeId, setItem, getLocationItems, id])

  return (
    <Portal id={id} selected={selected}>
      <div x-id={id} className="flex justify-center">
        ⛲
      </div>
      <div
        x-id={id}
        className="w-full grid grid-cols-2 gap-1 text-[0.6rem] place-items-center">
        <div className="bg-zinc-800 shadow-inner shadow-zinc-900 rounded-lg p-2">
          <div>📥 {locationItems.length}</div>
        </div>
        <div className="bg-zinc-800 shadow-inner shadow-zinc-900 rounded-lg p-1">
          <Flip to={toTime} />
        </div>
      </div>
      <BeltSource />
    </Portal>
  )
}

export default OutputPortal
