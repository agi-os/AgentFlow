/* eslint-disable react/prop-types */
import { useCallback } from 'react'
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  useNodes,
  Panel,
  SelectionMode,
  useReactFlow,
} from '@xyflow/react'
import CustomNode from './CustomNode'

import getLayoutedElements from './getLayoutedElements'

const initialNodes = [
  { id: 'a', type: 'input', position: { x: 0, y: 0 }, data: { label: 'wire' } },
  {
    id: 'b',
    type: 'custom',
    position: { x: -100, y: 100 },
    data: { label: 'drag me!' },
  },
  { id: 'c', position: { x: 100, y: 100 }, data: { label: 'your ideas' } },
  {
    id: 'd',
    type: 'output',
    position: { x: 0, y: 200 },
    data: { label: 'with React Flow' },
  },
]

const nodeTypes = {
  custom: CustomNode,
}

const initialEdges = [
  { id: 'a->c', source: 'a', target: 'c' },
  { id: 'b->d', source: 'b', target: 'd' },
  { id: 'c->d', source: 'c', target: 'd' },
]

const edgeTypes = {
  // Add your custom edge types here!
}

// function Sidebar() {
//   const nodes = useNodes()

//   return (
//     <aside>
//       {nodes.map(node => (
//         <div key={node.id}>
//           Node {node.id} - x: {node.position.x.toFixed(2)}, y:{' '}
//           {node.position.y.toFixed(2)}
//         </div>
//       ))}
//     </aside>
//   )
// }

const App = () => {
  const { fitView } = useReactFlow()

  // handle nodes
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)

  // handle edges
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // handle edge connections
  const onConnect = useCallback(
    connection => setEdges(edges => addEdge(connection, edges)),
    [setEdges]
  )

  const onLayout = useCallback(
    direction => {
      const layouted = getLayoutedElements(nodes, edges, { direction })

      setNodes([...layouted.nodes])
      setEdges([...layouted.edges])

      window.requestAnimationFrame(() => {
        fitView()
      })
    },
    [nodes, edges, setNodes, setEdges, fitView]
  )

  return (
    <>
      {/* <Sidebar /> */}
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        edgeTypes={edgeTypes}
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
