import { useContext, useEffect } from 'react'

import {
  Background,
  ReactFlow,
  Panel,
  useNodesState,
  useEdgesState,
  useStoreApi,
  useStore,
} from '@xyflow/react'

import { MIN_SPEED, MAX_SPEED } from './constants/_mainConfig'

import SchemaButton from './tmp/SchemaButton'

import { SocketContext } from './Socket'

import nodeTypes from './nodes/nodeTypes'
import edgeTypes from './edges/edgeTypes'

import initialNodes from './initialNodes'
import initialEdges from './initialEdges'
import useStoreExtension from './hooks/useStoreExtension/index'

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
  const onConnect = useOnConnect(setEdges)

  const socket = useContext(SocketContext)

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
  }, [socket, setNodes, nodes])

  return (
    <>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
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
        <Panel position="top-right">
          <SpeedRange />
        </Panel>
      </ReactFlow>
    </>
  )
}

const SpeedRange = () => {
  const speed = useStore(s => s.speed) ?? 37
  const setSpeed = useStore(s => s.setSpeed)

  return (
    <input
      type="range"
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      value={speed}
      onChange={e => setSpeed(e.target.value)}
      min={MIN_SPEED}
      max={MAX_SPEED}
      step="1"
    />
  )
}

export default App
