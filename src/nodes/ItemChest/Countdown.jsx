import { useEffect } from 'react'
import Flip from '../../components/Flip'
import useJitteryCountdown from '../../hooks/useJitteryCountdown'
import { useStore, useNodeId } from '@xyflow/react'

import {
  YELLOW_COUNTDOWN,
  GREEN_COUNTDOWN,
  BLUE_COUNTDOWN,
} from '../../constants/_mainConfig'

const Countdown = () => {
  // Get the node id
  const nodeId = useNodeId()

  // Get the edge semaphore data
  const semaphore = useStore(s => s.getNode(nodeId)?.data?.semaphore)

  // Get the semaphore delay from configuration
  const semaphoreDelay =
    semaphore === 'green'
      ? GREEN_COUNTDOWN
      : semaphore === 'yellow'
      ? YELLOW_COUNTDOWN
      : BLUE_COUNTDOWN

  // Get the countdown data
  const { to, count } = useJitteryCountdown({
    timer: semaphoreDelay * 1000, // Convert seconds to milliseconds
  })

  // Get store data
  const getLocationItemsSorted = useStore(s => s.getLocationItemsSorted)
  const edges = useStore(s => s.edges)
  const putOnBelt = useStore(s => s.putOnBelt)

  // Is output allowed?
  const outputAllowed = count <= 0 && semaphore !== 'red'

  useEffect(() => {
    // If the output is allowed
    if (!outputAllowed) return

    // Sanity check
    if (!getLocationItemsSorted || !putOnBelt || !edges || !nodeId) return

    // Get the next items in the queue
    const nextItems = getLocationItemsSorted(nodeId)

    // Filter out items that have a location.id already on the belt
    const nextItemFiltered = nextItems
      .filter(Boolean)
      .filter(i => !i.location.id || i.location.id === nodeId)

    // Get the first item in the queue of items that are not on the belt
    const nextItem = nextItemFiltered[0]

    // If there is no next item, abort
    if (!nextItem) return

    // Get the id of the edge on outbox of this node
    const edgeId = edges.find(
      e => e.sourceHandle === 'outbox' && e.source === nodeId
    )?.id

    // If there is no edge, abort
    if (!edgeId) return

    // Put the item on the belt
    putOnBelt({ itemId: nextItem.id, beltId: edgeId })
  }, [outputAllowed, getLocationItemsSorted, nodeId, putOnBelt, edges])

  const classNames = [
    ...countdownClassNames,
    semaphore === 'red' ? 'opacity-0' : 'opacity-100',
  ]

  return (
    <div className={classNames.join(' ')}>
      <Flip to={to} />
    </div>
  )
}

const countdownClassNames = [
  'bg-zinc-800',
  'shadow-inner',
  'shadow-zinc-900',
  'rounded-lg',
  'p-1',
  'absolute',
  'bottom-2',
  'left-1/2',
  '-ml-5',
  'outline',
  'outline-[0.25rem]',
  'outline-zinc-800',
  'transition-all',
]

export default Countdown
