import React from 'react'
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown'
import { useStore } from '@xyflow/react'

const Flip = React.memo(({ to }) => {
  // Get the current zoom level
  const zoom = useStore(s => s.transform[2])

  return (
    <div className="relative">
      <FlipClockCountdown
        className="flip-clock"
        to={to}
        renderMap={[false, false, false, true]}
        showLabels={false}
        hideOnComplete={false}
      />
      {zoom > 6 && (
        <input
          className="absolute left-[-3.95rem] -bottom-[0.65rem]
          transition-all duration-1000
          "
          style={{
            transform: `scale(0.1)`,
            width: '10rem',
            opacity: Math.min(Math.max((zoom - 9) / 2, 0), 1),
          }}
          type="range"
          min="0"
          max="100"
        />
      )}
    </div>
  )
})
export default Flip
