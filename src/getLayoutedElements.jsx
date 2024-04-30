import Dagre from '@dagrejs/dagre'

const getLayoutedElements = (nodes, edges, options) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))

  g.setGraph({
    rankdir: options.direction,
    nodesep: 250,
    ranksep: 150,
  })

  edges.forEach(edge => g.setEdge(edge.source, edge.target))
  nodes.forEach(node => g.setNode(node.id, node))

  Dagre.layout(g)

  return {
    nodes: nodes.map(node => {
      const { x, y } = g.node(node.id)

      return { ...node, position: { x, y } }
    }),
    edges,
  }
}

export default getLayoutedElements
