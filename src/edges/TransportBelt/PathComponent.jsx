import { memo, useEffect, useRef } from 'react'
import useTransportBeltStore from '../../hooks/useTransportBeltStore'

// A memoized React component passing path data to the store
const PathComponent = memo(({ id }) => {
  const { pathD, setPathRef } = useTransportBeltStore(id)

  // Reference to the path element
  const pathRef = useRef(null)

  // Update the path reference in the store when it changes
  useEffect(() => setPathRef(pathRef.current), [pathRef.current, setPathRef])

  // Render the path component with the calculated path data
  return (
    <path
      x-id={id}
      style={{ fill: 'none', stroke: 'none' }}
      d={pathD}
      ref={pathRef}
    />
  )
})

export default PathComponent
