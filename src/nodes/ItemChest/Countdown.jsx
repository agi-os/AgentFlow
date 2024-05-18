import { useEffect } from 'react'
import Flip from '../../components/Flip'
import useJitteryCountdown from '../../hooks/useJitteryCountdown'
import { useStore, useNodeId } from '@xyflow/react'
import putOnBelt from './putOnBelt'

const Countdown = () => {
  const { to, count } = useJitteryCountdown({ timer: 2_000 })
  const nodeId = useNodeId()

  // Get store data
  const setItem = useStore(s => s.setItem)
  const getLocationItemsSorted = useStore(s => s.getLocationItemsSorted)
  const edges = useStore(s => s.edges)

  useEffect(() => {
    if (count > 0) return
    // Add item on belt when countdown reaches 0
    putOnBelt({ getLocationItemsSorted, setItem, edges, nodeId })
  }, [edges, getLocationItemsSorted, nodeId, setItem, count])

  return (
    <div className={countdownClassNames.join(' ')}>
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
]

export default Countdown
