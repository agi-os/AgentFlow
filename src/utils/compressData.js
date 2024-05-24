import { normalizePositions } from './graph'
import { compressionMap } from '../constants/compression'

// Create Maps from the compressionMap object
const stringCompressionMap = new Map(Object.entries(compressionMap))

export const compressData = ({ nodes, edges }) => {
  // Pack nodes including the 'type' attribute
  const packedNodes = nodes.reduce(
    (obj, { id, data, position: { x, y }, type }) => {
      // Flatten the 'data' object into a tuple array
      const compressedData = Object.entries(data).flatMap(([key, value]) => [
        stringCompressionMap.get(key) || key,
        value,
      ])

      // Use half-id keys to save space, trim decimals from coordinates
      obj[id.split('-')[0]] = [
        compressedData,
        x,
        y,
        stringCompressionMap.get(type) || type,
      ]
      return obj
    },
    {}
  )

  // Pack edges with compression for specific patterns
  const packedEdges = edges.map(edge => {
    // Check if the edge matches the queue pattern
    if (
      edge.sourceHandle === 'outbox' &&
      edge.targetHandle === 'inbox' &&
      edge.type === 'queue' &&
      edge.animated
    ) {
      // Compress queue to a tuple
      return [edge.source.split('-')[0], edge.target.split('-')[0]]
    }

    // Return full edge
    return [
      edge.source.split('-')[0],
      stringCompressionMap.get(edge.sourceHandle) || edge.sourceHandle,
      edge.target.split('-')[0],
      stringCompressionMap.get(edge.targetHandle) || edge.targetHandle,
      stringCompressionMap.get(edge.type) || edge.type,
      edge.animated ? 1 : 0,
    ]
  })

  // Return compressed data with positions centered around 0, 0
  return normalizePositions({ n: packedNodes, e: packedEdges })
}
