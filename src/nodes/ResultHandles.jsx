import { Handle, Position } from '@xyflow/react'
import colorMap from '../constants/colorMap'

/**
 * Result handles component
 * @param {Object} data - The data object
 * @returns {JSX.Element} The result handles component
 */
const ResultHandles = ({ data }) => {
  // If result is not an object, abort
  if (typeof data.output !== 'object' || data.output === null) return null

  const flatData = Object.entries(data.output).flatMap(([bucket, array]) =>
    Array.isArray(array)
      ? array.map((result, index) => ({ bucket, result, index }))
      : []
  )

  // Calculate the step size based on the total length of the flattened data
  const step = 100 / flatData.length

  // Map over the flattened data to create the handles
  return flatData.map(({ bucket, result, index }, flatIndex) => {
    const offset = step * flatIndex + step / 2
    return (
      <Handle
        key={`${bucket}-${index}`}
        type="source"
        position={Position.Right}
        id={`result-${bucket}-${index}`}
        title={bucket}
        className={`result-handle ${colorMap[bucket]}`}
        style={{ top: `${offset}%` }}
      />
    )
  })
}

export default ResultHandles
