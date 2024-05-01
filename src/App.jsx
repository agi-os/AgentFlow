/* eslint-disable react/prop-types */
import { useCallback, useContext, useEffect } from 'react'
import { Background, ReactFlow, Panel, useReactFlow } from '@xyflow/react'

import getArrangedElements from './getArrangedElements'

import SchemaButton from './tmp/schema'

import { SocketContext } from './Socket'

import useStore from './store'
import { useShallow } from 'zustand/react/shallow'
import nodeTypes from './nodes/nodeTypes'

const selector = state => ({
  nodes: state.nodes,
  edges: state.edges,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
})

const App = () => {
  const socket = useContext(SocketContext)

  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(useShallow(selector))

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
    socket.on('schema loaded', schemaId => {
      // emit the get schema event with schema id and use callback to get the schema
      socket.emit('get schema', schemaId, schema => {
        // update the schema in the schema node
        const schemaNode = nodes.find(node => node.type === 'schema')
        schemaNode.data.schema = schema
        schemaNode.data.schemaId = schemaId
        setNodes([...nodes])

        // trigger 2x, once to repaint and get measurements, once to layout
        onLayout('TB')
        setTimeout(() => onLayout('TB'), 50)
      })
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
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode="dark"
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
