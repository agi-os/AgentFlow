import { compressionMap } from '../constants/compression'

// For decompression (invert key-value pairs):
export const decompressionMap = new Map(
  Object.entries(compressionMap).map(([key, value]) => [value, key])
)

// Reduce the flattened data to an object
const convertFlatArrayToObject = arr => {
  return arr.reduce((obj, value, index) => {
    // Check if the current index is even to assign as a key
    if (index % 2 === 0) {
      obj[value] = arr[index + 1] // Assign the next value as the corresponding value
    }
    return obj
  }, {})
}

export const decompressData = compressedData => {
  // Extract nodes
  const nodes = Object.entries(compressedData.n).map(([id, nodeData]) => {
    const [data, x, y, type] = nodeData

    // Convert raw tuples to object
    const rawData = convertFlatArrayToObject(data)

    // update data keys to original keys
    const decompressedData = Object.entries(rawData).map(([key, value]) => [
      decompressionMap.get(key) || key,
      value,
    ])

    return {
      id,
      data: decompressedData,
      position: { x, y },
      type: decompressionMap.get(type) || type,
    }
  })

  // Extract edges
  const edges = compressedData.e.map(edge => {
    if (edge.length === 2) {
      // Handle compressed queue edge
      const [source, target] = edge
      return {
        source,
        target,
        sourceHandle: 'outbox',
        targetHandle: 'inbox',
        type: 'queue',
        animated: true,
      }
    }

    // Handle the full edge
    const [source, sourceHandle, target, targetHandle, type, animated] = edge
    return {
      source,
      sourceHandle: decompressionMap.get(sourceHandle) || sourceHandle,
      target,
      targetHandle: decompressionMap.get(targetHandle) || targetHandle,
      type: decompressionMap.get(type) || type,
      animated: !!animated,
    }
  })

  return { nodes, edges }
}
