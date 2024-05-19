import { useEffect } from 'react'
import Flip from '../../components/Flip'
import useJitteryCountdown from '../../hooks/useJitteryCountdown'
import { useStore, useNodeId } from '@xyflow/react'
import putOnBelt from './putOnBelt'

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
  const setItem = useStore(s => s.setItem)
  const getLocationItemsSorted = useStore(s => s.getLocationItemsSorted)
  const edges = useStore(s => s.edges)

  useEffect(() => {
    if (count > 0) return

    if (semaphore === 'red') return

    // Add item on belt when countdown reaches 0
    putOnBelt({ getLocationItemsSorted, setItem, edges, nodeId })
  }, [edges, getLocationItemsSorted, nodeId, setItem, count, semaphore])

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
