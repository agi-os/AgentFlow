import { memo } from 'react'
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown'
import { useStore } from '@xyflow/react'

/**
 * Displays a flip clock countdown with an optional zoom-controlled range input.
 * @param {Object} props - The component props.
 * @param {number} props.to - The target time for the countdown.
 * @returns {JSX.Element} The rendered FlipTimer component.
 */
const FlipTimer = memo(({ to }) => {
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

export default FlipTimer
