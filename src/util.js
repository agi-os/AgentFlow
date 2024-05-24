import generateId from './hooks/useStoreExtension/generateId'
import { compressionMap } from './constants/compression'

// Create Maps from the compressionMap object
const stringCompressionMap = new Map(Object.entries(compressionMap))

// For decompression (invert key-value pairs):
const decompressionMap = new Map(
  Object.entries(compressionMap).map(([key, value]) => [value, key])
)

const compressData = ({ nodes, edges }) => {
  // Pack nodes including the 'type' attribute
  const packedNodes = nodes.reduce(
    (obj, { id, data, position: { x, y }, type }) => {
      // Use half-id keys to save space, trim decimals from coordinates
      obj[id.split('-')[0]] = [
        data,
        x | 0,
        y | 0,
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
      stringCompressionMap.get(edge.type) || edge.type || '',
      edge.animated ? 1 : 0,
    ]
  })
  // Return compressed data
  return { n: packedNodes, e: packedEdges }
}

export const decompressData = compressedData => {
  // Extract nodes
  const nodes = Object.entries(compressedData.n).map(
    ([id, [data, x, y, type]]) => ({
      id,
      data,
      position: { x, y },
      type: decompressionMap.get(type) || type,
    })
  )

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

export const fetchDataFromClipboard = async () => {
  const parsed = await readClipboardData()
  return decompressData(parsed)
}

export const calculateNewPositions = ({ nodes }) => {
  const { centroidX, centroidY } = calculateCentroid(nodes)
  return { centroidX, centroidY }
}

export const createNewGraphElements = (nodes, edges, x, y) => {
  const positions = calculateNewPositions({ nodes })

  const idMap = new Map()

  const newNodes = generateNewNodes(
    nodes,
    positions.centroidX,
    positions.centroidY,
    x,
    y,
    idMap
  )
  const newEdges = generateNewEdges(edges, idMap)
  return { newNodes, newEdges }
}

export const updateStates = ({ setNodes, setEdges, newNodes, newEdges }) => {
  setNodes(nds => [
    ...nds.map(node => ({ ...node, selected: false })),
    ...newNodes,
  ])
  setEdges(eds => [
    ...eds.map(edge => ({ ...edge, selected: false })),
    ...newEdges,
  ])
}

export const copyToClipboard = async data => {
  try {
    // Clone the data to not modify the source
    const { nodes, edges } = JSON.parse(JSON.stringify(data))

    // If there are no nodes, abort
    if (!nodes || nodes.length === 0) return

    // Compress the data
    const compressedData = compressData({ nodes, edges })

    await navigator.clipboard.writeText(JSON.stringify(compressedData))
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

export const handleCopyPasteKeypress = ({ event, onCopy, onPaste }) => {
  const { ctrlKey, key } = event
  if (ctrlKey && key === 'c') {
    onCopy()
  } else if (ctrlKey && key === 'v') {
    onPaste(event)
  }
}

export const readClipboardData = async () => {
  const clipboardData = await navigator.clipboard.readText()
  return JSON.parse(clipboardData)
}

export const calculateCentroid = nodes => {
  const centroidX =
    nodes.reduce((acc, node) => acc + node.position.x, 0) / nodes.length
  const centroidY =
    nodes.reduce((acc, node) => acc + node.position.y, 0) / nodes.length
  return { centroidX, centroidY }
}

export const generateNewEdges = (edges, idMap) => {
  return edges.map(edge => ({
    ...edge,
    id: generateId(),
    source: idMap.get(edge.source),
    target: idMap.get(edge.target),
  }))
}

export const generateNewNodes = (
  nodes,
  centroidX,
  centroidY,
  targetCenterX,
  targetCenterY,
  idMap
) => {
  return nodes.map(node => {
    const newId = generateId()
    idMap.set(node.id, newId)
    return {
      ...node,
      id: newId,
      position: {
        x: node.position.x - centroidX + targetCenterX,
        y: node.position.y - centroidY + targetCenterY,
      },
      selected: true,
    }
  })
}

import Ajv from 'ajv'

const ajv = new Ajv()

export const dataPacketSchema = {
  type: 'object',
  properties: {
    type: { type: 'string', description: 'Type of the item' },
    emoji: { type: 'string', description: 'Emoji representing the item' },
    data: { type: 'object', description: 'Arbitrary data payload' },
    metadata: {
      type: 'object',
      description: 'Metadata about the item (timestamps, source, etc.)',
      properties: {
        createdAt: { type: 'number', description: 'Timestamp of creation' },
        sourceNodeId: {
          type: 'string',
          description: 'ID of the node that created the item',
        },
      },
    },
  },
  required: ['type'],
}

const validate = ajv.compile(dataPacketSchema)

/**
 * Validates a data packet against a predefined schema.
 *
 * @param {Object} packet - The data packet to validate.
 * @returns {boolean} - True if the packet is valid, false otherwise.
 */
export const validateDataPacket = packet => {
  const valid = validate(packet)
  if (!valid) {
    console.log('Validation errors:', validate.errors)
    return false
  }
  return true
}
