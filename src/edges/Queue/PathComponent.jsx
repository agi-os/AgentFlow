import { memo, useEffect } from 'react'

/**
 * Represents a path component used in the Queue edge.
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.pathD - The path data for the component.
 * @param {Object} props.pathRef - The reference to the path element.
 * @param {Function} props.onLengthChange - The callback function to be called when the length changes.
 * @returns {JSX.Element} The rendered path component.
 */
const PathComponent = memo(({ pathD, pathRef, onLengthChange }) => {
  useEffect(() => {
    // Get the new length of the path
    const newLength = pathRef?.current?.getTotalLength?.() || 0

    // Call the callback with the new length
    if (onLengthChange && typeof onLengthChange === 'function') {
      onLengthChange(newLength)
    }
  }, [pathD, onLengthChange, pathRef]) // recompute the length when the path changes

  return (
    <path style={{ fill: 'none', stroke: 'none' }} d={pathD} ref={pathRef} />
  )
})

export default PathComponent
