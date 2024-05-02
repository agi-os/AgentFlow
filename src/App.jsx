import { useCallback, useContext, useEffect, useRef } from 'react'

import {
  Background,
  ReactFlow,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
} from '@xyflow/react'

import getArrangedElements from './getArrangedElements'

import SchemaButton from './tmp/schema'

import { SocketContext } from './Socket'

import nodeTypes from './nodes/nodeTypes'
import { classNames } from './tmp/schema'
const buttonClassNames = classNames

const initialNodes = [
  {
    id: 'content',
    type: 'entry',
    position: { x: 0, y: 0 },
    data: { text: 'John Doe born 1999' },
  },

  {
    id: 'action',
    type: 'action',
    position: { x: 400, y: 600 },
    data: { text: 'action node' },
  },

  { id: 'emit', type: 'emit', position: { x: 600, y: 600 } },
  {
    id: 'result',
    type: 'result',
    position: { x: 400, y: 400 },
    data: { text: 'result node' },
  },
]

const initialEdges = [
  { id: 'e1', source: 'content', target: 'emit' },
  { id: 'e2', source: 'emit', target: 'action' },
  { id: 'e3', source: 'action', target: 'result' },
]

let id = 1
const getId = () => `${id++}`

const App = () => {
  const connectingNodeId = useRef(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const { screenToFlowPosition } = useReactFlow()

  const onConnect = useCallback(
    params => setEdges(eds => addEdge(params, eds)),
    [setEdges]
  )

  const socket = useContext(SocketContext)

  const onNodesDelete = useCallback(
    deleted => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges)
          const outgoers = getOutgoers(node, nodes, edges)
          const connectedEdges = getConnectedEdges([node], edges)

          const remainingEdges = acc.filter(
            edge => !connectedEdges.includes(edge)
          )

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            }))
          )

          return [...remainingEdges, ...createdEdges]
        }, edges)
      )
    },
    [nodes, edges]
  )

  const { fitView } = useReactFlow()

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

  // initial layout
  useEffect(() => {
    onLayout('TB')
    setTimeout(() => onLayout('TB'), 50)
  }, [])

  // load schema
  useEffect(() => {
    if (!socket) return

    // when schema is loaded to the server
    socket.on('schema loaded', ({ schemaId, schemaJson }) => {
      console.log('schema loaded', schemaId, schemaJson)

      // update the schema in the schema node
      const schemaNode = nodes.find(node => node.type === 'schema')
      schemaNode.data.schema = JSON.parse(schemaJson)
      setNodes([...nodes])

      // trigger 2x, once to repaint and get measurements, once to layout
      onLayout('TB')
      setTimeout(() => onLayout('TB'), 50)
      // })
    })

    // cleanup
    return () => {
      socket.off('schema loaded')
    }
  }, [socket, setNodes, onLayout, nodes])

  return (
    <>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        onNodesDelete={onNodesDelete}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode="dark"
        minZoom={0.2}
        maxZoom={4}
        // selectionOnDrag
        // panOnDrag={panOnDrag}
        // selectionMode={SelectionMode.Partial}
        fitView>
        <Background />
        <Panel position="top-left">
          <SchemaButton />
        </Panel>
        <Panel position="top-right">
          <button
            className={buttonClassNames.join(' ')}
            onClick={() => onLayout('TB')}>
            update layout
          </button>
        </Panel>{' '}
      </ReactFlow>
    </>
  )
}

export default App
