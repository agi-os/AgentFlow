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

  {
    id: 'action',
    type: 'action',
    position: { x: 400, y: 600 },
    data: { text: 'action node' },
  },

  { id: 'emit', type: 'emit', position: { x: 600, y: 600 } },
]

const initialEdges = [
  { id: 'schema->emit', source: 'schema', target: 'emit' },
  { id: 'd->emit', source: 'content', target: 'emit' },
  { id: 'emit->r', source: 'emit', target: 'result' },
  { id: 'emit->a', source: 'emit', target: 'action' },
]

let id = 1
const getId = () => `${id++}`

const App = () => {
  const connectingNodeId = useRef(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const { screenToFlowPosition } = useReactFlow()

  const onConnect = useCallback(params => {
    // reset the start node on connections
    connectingNodeId.current = null
    setEdges(eds => addEdge(params, eds))
  }, [])

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId
  }, [])

  const onConnectEnd = useCallback(
    event => {
      if (!connectingNodeId.current) return

      const targetIsPane = event.target.classList.contains('react-flow__pane')

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getId()
        const newNode = {
          id,
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          type: 'result',
          data: { label: `Node ${id}` },
          origin: [0.5, 0.0],
        }

        setNodes(nds => nds.concat(newNode))
        setEdges(eds =>
          eds.concat({ id, source: connectingNodeId.current, target: id })
        )
      }
    },
    [screenToFlowPosition, setEdges, setNodes]
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

  // const onConnect = useCallback(
  //   connection => setEdges(eds => addEdge(connection, eds)),
  //   [setEdges]
  // )

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
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
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
            className="bg-gray-800 text-gray-500 font-bold py-2 px-4 rounded"
            onClick={() => onLayout('TB')}>
            update layout
          </button>
        </Panel>{' '}
      </ReactFlow>
    </>
  )
}

export default App
