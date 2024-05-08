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

import anime from 'animejs/lib/anime.es.js'

import getArrangedElements from './getArrangedElements'

import SchemaButton from './tmp/schema'

import { SocketContext } from './Socket'

import nodeTypes from './nodes/nodeTypes'
import { classNames } from './tmp/schema'
import initialNodes from './initialNodes'
import initialEdges from './initialEdges'

const buttonClassNames = classNames

const App = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

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
    // onLayout('LR')

    setTimeout(() => {
      // onLayout('LR')
    }, 50)

    setTimeout(() => {
      var path = anime.path('.react-flow__edge path')
      console.log(path('x'))

      anime({
        targets: '.foo-test',
        translateX: path('x'),
        translateY: path('y'),
        rotate: path('angle'),
        easing: 'easeInOutSine',
        duration: 2000,
        loop: true,
      })
    }, 100)
  }, [])

  // load schema
  useEffect(() => {
    if (!socket) return

    // when schema is loaded to the server
    socket.on('schema loaded', ({ schemaId, schemaJson }) => {
      // update the schema in the schema node
      const schemaNode = nodes.find(node => node.type === 'schema')
      schemaNode.data.schema = JSON.parse(schemaJson)
      setNodes([...nodes])

      // trigger 2x, once to repaint and get measurements, once to layout
      // onLayout('LR')
      // setTimeout(() => onLayout('LR'), 50)
      // })
    })

    // cleanup
    return () => {
      socket.off('schema loaded')
    }
  }, [socket, setNodes, onLayout, nodes])

  return (
    <>
      <div
        className={[
          'foo-test',
          'rounded-md',
          'bg-teal-800',
          'absolute',
          'w-9',
          'h-9',
          'z-10',
        ].join(' ')}
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        onNodesDelete={onNodesDelete}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode="dark"
        minZoom={1}
        maxZoom={1}
        // selectionOnDrag
        // panOnDrag={panOnDrag}
        // selectionMode={SelectionMode.Partial}
        // fitView
      >
        <Background />
        <Panel position="top-left">
          <SchemaButton />
        </Panel>
        <Panel position="top-right">
          <button
            className={buttonClassNames.join(' ')}
            onClick={() => onLayout('LR')}>
            update layout
          </button>
        </Panel>
        <Panel position="bottom-left">
          <SchemaButton old />
        </Panel>
      </ReactFlow>
    </>
  )
}

export default App
