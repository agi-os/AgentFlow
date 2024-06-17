import { memo, useEffect, useRef } from 'react'
import useTransportBeltStore from '../../hooks/useTransportBeltStore'

// A memoized React component passing path data to the store
const PathComponent = memo(({ id }) => {
  // Get the latest state from the store
  const { pathD, setPathRef } = useTransportBeltStore(id).getState()

  // Reference to the path element in React context
  const reactPathRef = useRef(null)

  // Update the path reference in the store when it changes
  useEffect(() => {
    setPathRef(reactPathRef.current)
  }, [reactPathRef, setPathRef])

  // Render the path component with the calculated path data
  return (
    <path
      x-id={id}
      style={{ fill: 'none', stroke: 'none' }}
      d={pathD}
      ref={reactPathRef}
    />
  )
})

export default PathComponent
