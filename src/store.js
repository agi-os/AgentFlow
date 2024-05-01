import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react'

const loadedSchema = {
  age: {
    _def: {
      checks: [
        {
          kind: 'min',
          value: 0,
          inclusive: true,
        },
        {
          kind: 'max',
          value: 120,
          inclusive: true,
        },
      ],
      typeName: 'ZodNumber',
      coerce: false,
      description: 'The age of the user',
    },
  },
}
const initialNodes = [
  {
    id: 'd',
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
    id: 'r',
    type: 'result',
    position: { x: 400, y: 400 },
    data: { text: 'result node' },
  },

  { id: 'emit', type: 'emit', position: { x: 600, y: 600 } },
]

const initialEdges = [
  { id: 'schema->emit', source: 'schema', target: 'emit' },
  { id: 'd->emit', source: 'd', target: 'emit' },
  { id: 'emit->r', source: 'emit', target: 'r' },
]

// this is our useStore hook that we can use in our components to get parts of the store and call actions

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
