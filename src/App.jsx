import { useCallback, useContext, useEffect } from 'react'

import {
  Background,
  ReactFlow,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  useStoreApi,
} from '@xyflow/react'

import getArrangedElements from './getArrangedElements'

import SchemaButton from './tmp/SchemaButton'

import { SocketContext } from './Socket'

import nodeTypes from './nodes/nodeTypes'
import edgeTypes from './edges/edgeTypes'

import initialNodes from './initialNodes'
import initialEdges from './initialEdges'
import useStoreExtension from './hooks/useStoreExtension/index'

// import DevTools from './devtools/Devtools'

import { randomProspects } from './initialNodes'

import useIsValidConnection from './hooks/useIsValidConnection'
import useOnConnect from './hooks/useOnConnect'

const initialItems = randomProspects
  // remove ids
  // eslint-disable-next-line no-unused-vars
  .map(({ id, ...rest }) => rest)
  // rename type to jobType
  .map(({ type, ...rest }) => ({ jobType: type, ...rest }))
  // add type 'prospect'
  .map(item => ({ type: 'prospect', ...item }))

const App = () => {
  // Extend the ReactFlow store with custom functionality
  useStoreExtension({ initialItems })

  // Get a handle to the store api
  const storeApi = useStoreApi()

  // Get the isValidConnection function
  const isValidConnection = useIsValidConnection(storeApi)

  // Link the nodes and edges to the store
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Handle connection events
  const onConnect = useOnConnect(storeApi, setEdges)

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
    [setEdges, edges, nodes]
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

  // load schema
  useEffect(() => {
    if (!socket) return

    // when schema is loaded to the server
    socket.on('schema loaded', ({ schemaJson }) => {
      const schemaNode = nodes.find(node => node.type === 'schema')
      schemaNode.data.schema = JSON.parse(schemaJson)
      setNodes([...nodes])
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
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        onNodesDelete={onNodesDelete}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        deleteKeyCode={'Delete'}
        colorMode="dark"
        minZoom={0.05}
        maxZoom={16}
        connectionMode="loose">
        <Background />
        <Panel position="top-left">
          <SchemaButton />
        </Panel>
        <Panel position="bottom-left">
          <SchemaButton old />
        </Panel>
        {/* <DevTools /> */}
      </ReactFlow>
    </>
  )
}

export default App
