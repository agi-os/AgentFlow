import { useContext, useEffect, useCallback } from 'react'

import {
  Background,
  ReactFlow,
  Panel,
  useNodesState,
  useEdgesState,
  useStoreApi,
  useStore,
} from '@xyflow/react'

import SchemaButton from './tmp/SchemaButton'
import SpeedRange from './components/SpeedRange'

import { SocketContext } from './Socket'

import nodeTypes from './nodes/nodeTypes'
import edgeTypes from './edges/edgeTypes'

import initialNodes from './initialNodes'
import initialEdges from './initialEdges'
import useStoreExtension from './hooks/useStoreExtension/index'

import { randomProspects } from './initialNodes'

import useIsValidConnection from './hooks/useIsValidConnection'
import useOnConnect from './hooks/useOnConnect'

const initialItems = randomProspects(10)
  // remove ids
  // eslint-disable-next-line no-unused-vars
  .map(({ id, ...rest }) => rest)
  // rename type to jobType
  .map(({ type, ...rest }) => ({ jobType: type, ...rest }))
  // add type 'prospect'
  .map(item => ({ type: 'prospect', ...item }))

import {
  copyToClipboard,
  fetchDataFromClipboard,
  createNewGraphElements,
  handleCopyPasteKeypress,
  updateStates,
} from './util'

const App = () => {
  // Extend the ReactFlow store with custom functionality
  useStoreExtension({ initialItems })

  // Get the x and y offset from store
  const [x, y, z] = useStore(s => s.transform)
  const width = useStore(s => s.width)
  const height = useStore(s => s.height)

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

  // Handle copy
  const onCopy = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected)

    const selectedEdges = edges.filter(edge => {
      const isSourceSelected = selectedNodes.some(
        node => node.id === edge.source
      )
      const isTargetSelected = selectedNodes.some(
        node => node.id === edge.target
      )
      return isSourceSelected && isTargetSelected
    })

    copyToClipboard({ nodes: selectedNodes, edges: selectedEdges })
  }, [nodes, edges])

  // Handle paste
  const onPaste = useCallback(async () => {
    try {
      // Get offset by half of viewport width and height
      const xOffset = (width / 2 - x) * (1 / z)
      const yOffset = (height / 2 - y) * (1 / z)

      const data = await fetchDataFromClipboard()
      if (data.nodes && data.edges) {
        const { newNodes, newEdges } = createNewGraphElements(
          data.nodes,
          data.edges,
          xOffset,
          yOffset
        )
        updateStates({ setNodes, setEdges, newNodes, newEdges })
      }
    } catch (err) {
      console.error('Failed to paste: ', err)
    }
  }, [height, setEdges, setNodes, width, x, y, z])

  // Start listening for clipboard keypress events
  useEffect(() => {
    const handleKeydown = event =>
      handleCopyPasteKeypress({ event, onCopy, onPaste })
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [onCopy, onPaste])

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
        minZoom={0.01}
        maxZoom={40}
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

export default App
