import { useEffect } from 'react'
import { BeltSource } from '../../components/BeltPort'
import Portal from './Portal'
import { useStore, useNodeId } from '@xyflow/react'
import useJitteryCountdown from '../../hooks/useJitteryCountdown'
import Title from '../../components/Title'

import Flip from '../../components/Flip'

import {
  YELLOW_COUNTDOWN,
  GREEN_COUNTDOWN,
  BLUE_COUNTDOWN,
} from '../../constants/_mainConfig'

/**
 * Renders an output portal component.
 * @param {string} id - The ID of the portal.
 * @param {boolean} selected - Indicates whether the portal is selected.
 * @returns {JSX.Element} The output portal component.
 */
const OutputPortal = ({ id, selected }) => {
  // Get the node id
  const nodeId = useNodeId()

  // Get the edge semaphore data
  const semaphore = useStore(s => s.getNode(nodeId)?.data?.semaphore)

  // Get the setItemLocation function
  const setItemLocation = useStore(s => s.setItemLocation)

  // Get the semaphore delay from configuration
  const semaphoreDelay =
    semaphore === 'green'
      ? GREEN_COUNTDOWN
      : semaphore === 'yellow'
      ? YELLOW_COUNTDOWN
      : BLUE_COUNTDOWN

  // Create a countdown timer
  const { count, to } = useJitteryCountdown({ timer: semaphoreDelay * 1000 })

  // Get all connections to this portal
  const edges = useStore(s => s.getNodeEdges(id))

  // Get a handle to the getLocationItems function
  const getLocationItems = useStore(s => s.getLocationItems)

  // Find the edge connected to our outbox
  const outboxEdgeId = edges.find(edge => edge.sourceHandle === 'outbox')?.id

  // Get the count of items waiting in the inbox
  const locationItems = getLocationItems(id)

  // Release happens when conditions are met: countdown below zero, semaphore not red, outbox edge exists, location items exist
  const releaseEnabled =
    count <= 0 &&
    semaphore !== 'red' &&
    !!outboxEdgeId &&
    locationItems.length > 0

  // Watch any incoming items and move them all to the outbox belt
  useEffect(() => {
    // If release is not enabled, do nothing
    if (!releaseEnabled) return

    // Sanity check
    if (!id || !setItemLocation) return

    // Work on the received items
    locationItems.forEach(item => {
      // Sanity check
      if (!item) return

      // Only update the item if its location is not already the outbox
      if (item.location.id !== outboxEdgeId) {
        console.log(
          `portal 🔗${id} released item 📦${item.id} on belt 🛝${outboxEdgeId}`
        )

        // Update the item location to the outbox
        const itemId = item.id
        const locationId = outboxEdgeId
        setItemLocation({ itemId, locationId })
      }
    })
  }, [releaseEnabled, outboxEdgeId, locationItems, setItemLocation, id])

  return (
    <Portal id={id} selected={selected}>
      <Title id={id}>🔗 OutPortal</Title>{' '}
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
          {semaphore === 'red' ? (
            <div className="text-xl leading-none">🚦</div>
          ) : (
            <Flip to={to} />
          )}
        </div>
      </div>
      <BeltSource />
    </Portal>
  )
}

export default OutputPortal
