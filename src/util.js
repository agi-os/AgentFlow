import generateId from './hooks/useStoreExtension/generateId'

const compressData = ({ nodes, edges }) => {
  // Pack nodes including the 'type' attribute
  const packedNodes = nodes.reduce(
    (obj, { id, data, position: { x, y }, type }) => {
      obj[id] = [data, x, y, type]
      return obj
    },
    {}
  )

  // Pack edges
  const packedEdges = edges.map(edge => [
    edge.source,
    edge.sourceHandle,
    edge.target,
    edge.targetHandle,
  ])

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
      type,
    })
  )

  // Extract edges
  const edges = compressedData.e.map(
    ([source, sourceHandle, target, targetHandle]) => ({
      source,
      sourceHandle,
      target,
      targetHandle,
    })
  )

  return { nodes, edges }
}

export const fetchDataFromClipboard = async () => {
  const parsed = await readClipboardData()
  return decompressData(parsed)
}

export const calculateNewPositions = nodes => {
  const { centroidX, centroidY } = calculateCentroid(nodes)
  const targetCenterX = 100 * Math.random()
  const targetCenterY = 300 * Math.random()
  return { centroidX, centroidY, targetCenterX, targetCenterY }
}

export const createNewGraphElements = (nodes, edges, positions, idMap) => {
  const newNodes = generateNewNodes(
    nodes,
    positions.centroidX,
    positions.centroidY,
    positions.targetCenterX,
    positions.targetCenterY,
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
    }
  })
}
