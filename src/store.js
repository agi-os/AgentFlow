import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react'

const loadedSchema = {
  noSchema: {
    _def: {
      description: 'No schema loaded',
    },
  },
}
const initialNodes = [
  {
    id: 'content',
    type: 'entry',
    position: { x: 0, y: 0 },
    data: { text: 'John Doe born 1999' },
  },

  {
    id: 'schema',
    type: 'schema',
    position: { x: 200, y: 200 },
    data: { schema: loadedSchema },
  },

  {
    id: 'result',
    type: 'result',
    position: { x: 400, y: 400 },
    data: { text: 'result node' },
  },

  { id: 'emit', type: 'emit', position: { x: 600, y: 600 } },
]

const initialEdges = [
  { id: 'schema->emit', source: 'schema', target: 'emit' },
  { id: 'd->emit', source: 'content', target: 'emit' },
  { id: 'emit->r', source: 'emit', target: 'result' },
]

const useStore = create(
  persist(
    (set, get) => ({
      nodes: initialNodes,
      edges: initialEdges,
      onNodesChange: changes => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        })
      },
      onEdgesChange: changes => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        })
      },
      onConnect: connection => {
        set({
          edges: addEdge(connection, get().edges),
        })
      },
      setNodes: nodes => {
        set({ nodes })
      },
      setEdges: edges => {
        set({ edges })
      },
      updateNodeColor: (nodeId, color) => {
        set({
          nodes: get().nodes.map(node => {
            if (node.id === nodeId) {
              node.data = { ...node.data, color }
            }

            return node
          }),
        })
      },
    }),
    {
      name: 'agent-flow-store',
    }
  )
)

export default useStore
