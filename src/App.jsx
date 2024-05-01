/* eslint-disable react/prop-types */
import { useCallback, useContext, useEffect } from 'react'
import {
  Background,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  useReactFlow,
} from '@xyflow/react'
import CustomNode from './CustomNode'

import getArrangedElements from './getArrangedElements'

import SchemaButton from './tmp/schema'
import SchemaNode from './SchemaNode'
import EntryNode from './EntryNode'
import ResultNode from './ResultNode'

import { SocketContext } from './Socket'
import EmitNode from './EmitNode'

const nodeTypes = {
  custom: CustomNode,
  schema: SchemaNode,
  entry: EntryNode,
  result: ResultNode,
  emit: EmitNode,
}

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

const App = () => {
  const socket = useContext(SocketContext)

  const { fitView } = useReactFlow()

  // handle nodes
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)

  // handle edges
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // layout the nodes
  const onLayout = useCallback(
    direction => {
      const arranged = getArrangedElements(nodes, edges, { direction })

      setNodes([...arranged.nodes])
      setEdges([...arranged.edges])

      window.requestAnimationFrame(() => {
        fitView()
      })
    },
    [nodes, edges, setNodes, setEdges, fitView]
  )

  // load schema
  useEffect(() => {
    if (!socket) return

    // when schema is loaded to the server
    socket.on('schema loaded', schemaId => {
      // emit the get schema event with schema id and use callback to get the schema
      socket.emit('get schema', schemaId, schema => {
        // update the schema in the schema node
        setNodes(nodes => {
          const schemaNode = nodes.find(node => node.type === 'schema')
          schemaNode.data.schema = schema
          schemaNode.data.schemaId = schemaId
          return [...nodes]
        })
        // trigger 2x, once to repaint and get measurements, once to layout
        onLayout('TB')
        setTimeout(() => onLayout('TB'), 50)
      })
    })

    // cleanup
    return () => {
      socket.off('schema loaded')
    }
  }, [socket, setNodes, onLayout])

  // handle edge connections
  const onConnect = useCallback(
    connection => setEdges(edges => addEdge(connection, edges)),
    [setEdges]
  )

  return (
    <>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode="dark"
        // selectionOnDrag
        // panOnDrag={panOnDrag}
        // selectionMode={SelectionMode.Partial}
        fitView>
        <Background />
        {/* <MiniMap /> */}
        {/* <Controls /> */}
        <Panel position="top-left">
          <SchemaButton />
        </Panel>
        <Panel position="top-right">
          <button
            className="bg-gray-800 text-gray-500 font-bold py-2 px-4 rounded"
            onClick={() => onLayout('TB')}>
            vertical layout
          </button>
        </Panel>{' '}
      </ReactFlow>
    </>
  )
}

export default App
