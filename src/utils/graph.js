import generateId from '../hooks/useStoreExtension/generateId'

export const normalizePositions = obj => {
  // Find the center point
  let minX = Infinity,
    maxX = -Infinity
  let minY = Infinity,
    maxY = -Infinity

  Object.values(obj.n).forEach(([, x, y]) => {
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y)
  })

  const centerX = Math.round((minX + maxX) / 2)
  const centerY = Math.round((minY + maxY) / 2)

  // Adjust positions directly within the object
  for (const id in obj.n) {
    obj.n[id][1] -= centerX // Adjust x-coordinate
    obj.n[id][2] -= centerY // Adjust y-coordinate
  }

  // Round the positions to integers
  for (const id in obj.n) {
    obj.n[id][1] = Math.round(obj.n[id][1])
    obj.n[id][2] = Math.round(obj.n[id][2])
  }

  return obj
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
