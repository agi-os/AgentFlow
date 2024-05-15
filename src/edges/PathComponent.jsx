import { memo } from 'react'
/**
 * Represents a path component used in rendering edges.
 * @param {Object} props - The component props.
 * @param {string} props.pathD - The path data for the path component.
 * @param {string} props.markerEnd - The marker for the end of the path component.
 * @param {string} props.markerStart - The marker for the start of the path component.
 * @param {React.Ref} props.pathRef - The ref for the path component.
 * @returns {JSX.Element} The rendered path component.
 */
const PathComponent = memo(({ pathD, markerEnd, markerStart, pathRef }) => {
  return (
    <path
      style={{ fill: 'none', stroke: 'none' }}
      d={pathD}
      markerEnd={markerEnd}
      markerStart={markerStart}
      ref={pathRef} // BaseEdge does not expose the path element ref
    />
  )
})

export default PathComponent
