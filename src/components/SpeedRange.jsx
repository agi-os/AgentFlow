import { useStore } from '@xyflow/react'

import { MIN_SPEED, MAX_SPEED } from '../constants/_mainConfig'

const SpeedRange = () => {
  const speed = useStore(s => s.speed) ?? 37
  const setSpeed = useStore(s => s.setSpeed)

  return (
    <input
      type="range"
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      value={speed}
      onChange={e => setSpeed(e.target.value)}
      min={MIN_SPEED}
      max={MAX_SPEED}
      step="1"
    />
  )
}

export default SpeedRange
