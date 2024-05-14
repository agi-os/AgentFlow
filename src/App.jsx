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

// import anime from 'animejs/lib/anime.es.js'

import getArrangedElements from './getArrangedElements'

import SchemaButton from './tmp/schema'

import { SocketContext } from './Socket'

import nodeTypes from './nodes/nodeTypes'
import edgeTypes from './edges/edgeTypes'

import { classNames } from './tmp/schema'
import initialNodes from './initialNodes'
import initialEdges from './initialEdges'
import useStoreExtension from './hooks/useStoreExtension'

// import DevTools from './devtools/Devtools'

const buttonClassNames = classNames

import { randomProspects } from './initialNodes'

const initialItems = randomProspects
  // remove ids
  .map(({ id, ...rest }) => rest)
  // rename type to jobType
  .map(({ type, ...rest }) => ({ jobType: type, ...rest }))
  // add type 'prospect'
  .map(item => ({ type: 'prospect', ...item }))

const App = () => {
  // Extend the ReactFlow store with custom functionality
  useStoreExtension({ initialItems })

  // Link the nodes and edges to the store
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Handle connection events
  const onConnect = useCallback(
    connection => {
      const edge = { ...connection, type: 'animated', animated: true }
      setEdges(eds => addEdge(edge, eds))
    },
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

  // Flag to track if an update is already scheduled
  // const updateScheduledRef = useRef(false)

  // update layout on button click
  const onUpdateLayout = useCallback(() => {
    // disable animation
    return false
    /*

    // If an update is already scheduled, do nothing
    if (updateScheduledRef.current) return

    // Schedule the update using requestAnimationFrame
    updateScheduledRef.current = true

    // Perform the update in the next frame
    requestAnimationFrame(() => {
      // Reset the flag
      updateScheduledRef.current = false

      // create a handle to the animation
      let animation

      // try to get the existing animation
      if (window.anm) {
        animation = window.anm
      }

      // remember the location
      let currentProgress = 0

      // if the animation exists, stop it and clean memory
      if (animation) {
        // get the current location in the animation
        currentProgress = animation.progress

        // pause the animation
        animation.pause()

        // remove from active instances
        const index = anime.running.indexOf(animation)
        if (index > -1) {
          anime.running.splice(index, 1)
        }

        // remove all handles to the animation object
        window.anm = null
      }

      // get the current path
      const path = anime.path('.react-flow__edge path')

      // create new animation
      animation = anime({
        targets: '.foo-test',
        translateX: path('x'),
        translateY: path('y'),
        rotate: path('angle'),
        easing: 'easeInOutQuad',
        duration: 2000,
        loop: true,
        autoplay: false,
      })

      // calculate location based on the progress
      const progress = (currentProgress / 100) * animation.duration

      // seek to the location
      animation.seek(progress)

      // play the animation
      animation.play()

      // save the animation reference
      window.anm = animation
    })
    */
  }, [])

  // initial layout after short delay
  useEffect(() => {
    setTimeout(onUpdateLayout, 100)
  }, [onUpdateLayout])

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
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={props => {
          setTimeout(onUpdateLayout, 100)
          onNodesChange(props)
        }}
        edges={edges}
        onNodesDelete={onNodesDelete}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={args => {
          // ignore self-connections
          if (args.source === args.target) return false

          console.log(args)

          // allow all other connections
          return true
        }}
        // delete with delete key
        deleteKeyCode={'Delete'}
        colorMode="dark"
        minZoom={0.1}
        maxZoom={10}
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
            onClick={onUpdateLayout}>
            update layout
          </button>
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
