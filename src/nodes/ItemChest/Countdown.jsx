import { useEffect } from 'react'
import Flip from '../../components/Flip'
import useJitteryCountdown from '../../hooks/useJitteryCountdown'
import { useStore, useNodeId } from '@xyflow/react'
import putOnBelt from './putOnBelt'

const Countdown = () => {
  // Get the node id
  const nodeId = useNodeId()

  // Get the edge semaphore data
  const semaphore = useStore(s => s.getNode(nodeId)?.data?.semaphore)

  // Get the countdown data
  const { to, count } = useJitteryCountdown({
    timer: semaphore === 'green' ? 1500 : semaphore === 'yellow' ? 7500 : 4500,
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

  return (
    <div className={countdownClassNames.join(' ')}>
      {semaphore !== 'red' && <Flip to={to} />}
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
]

export default Countdown
