import { useEffect, useCallback } from 'react'

import {
  Background,
  ReactFlow,
  Panel,
  useNodesState,
  useEdgesState,
  useStoreApi,
  useStore,
} from '@xyflow/react'

import NodeButtons from './components/NodeButtons'
import SpeedRange from './components/SpeedRange'

import nodeTypes from './nodes/nodeTypes'
import edgeTypes from './edges/edgeTypes'

import useStoreExtension from './hooks/useStoreExtension/index'

import useIsValidConnection from './hooks/useIsValidConnection'
import useOnConnect from './hooks/useOnConnect'

import {
  copyToClipboard,
  fetchDataFromClipboard,
  handleCopyPasteKeypress,
} from './utils/clipboard'
import { updateStates, createNewGraphElements } from './utils/graph'

/**
 * App component for the ReactFlow application.
 *
 * This component sets up the main functionality for the application, including:
 * - Extending the ReactFlow store with custom functionality
 * - Handling copy and paste operations for nodes and edges
 * - Listening for clipboard keypress events to trigger copy and paste
 * - Generating IDs for edges that do not have them
 * - Rendering the ReactFlow component with nodes, edges, and custom components
 *
 * @component
 */
const App = () => {
  // Extend the ReactFlow store with custom functionality
  useStoreExtension()

  // Get the x and y offset from store
  const [x, y, z] = useStore(s => s.transform)
  const width = useStore(s => s.width)
  const height = useStore(s => s.height)

  // Get a handle to the store api
  const storeApi = useStoreApi()

  // Get the isValidConnection function
  const isValidConnection = useIsValidConnection(storeApi)

  // Link the nodes and edges to the store
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Handle connection events
  const onConnect = useOnConnect(setEdges)

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
    // Definite the keydown event handler
    const handleKeydown = event =>
      handleCopyPasteKeypress({ event, onCopy, onPaste })

    // Add the event listener
    document.addEventListener('keydown', handleKeydown)

    // Remove the event listener on cleanup
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [onCopy, onPaste])

  const { setState } = useStoreApi()
  const generateId = useStore(state => state.generateId)

  useEffect(() => {
    // Check for edges without IDs and generate them
    const edgesNeedIDs = edges.filter(edge => !edge.id)
    if (edgesNeedIDs.length > 0) {
      setState(draft => ({
        ...draft,
        edges: draft.edges.map(edge =>
          edge.id ? edge : { ...edge, id: generateId() }
        ),
      }))
    }
  }, [edges, generateId, setState])

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
        snapToGrid={true}
        snapGrid={[30, 30]}
        panOnDrag={[1, 2, 3, 4]}
        selectionOnDrag={true}
        selectionMode="partial"
        connectionMode="loose">
        <Background gap={[30, 30]} color="#333" size={1} />
        <Panel position="top-left">
          <NodeButtons />
        </Panel>
        <Panel position="top-right">
          <SpeedRange />
        </Panel>
      </ReactFlow>
    </>
  )
}

export default App
