import {
  Handle,
  Position,
  useHandleConnections,
  useNodesData,
  useReactFlow,
} from '@xyflow/react'
import classNames from '../constants/classNames'

import Pre from '../components/Pre'
import Title from '../components/Title'
import { useEffect } from 'react'
import colorMap from '../constants/colorMap'
import ResultHandles from './ResultHandles'

import useOutput from '../hooks/useOutput'

const ResultNode = ({ id, data }) => {
  // Get a handle on the updateNodeData function
  const { updateNodeData } = useReactFlow()

  // Get all connections that are connected to this node
  const connections = useHandleConnections({ type: 'target' })

  // Get all nodes that are connected to this node
  const nodes = useNodesData(connections.map(connection => connection.source))

  // Get the output from the incoming connections
  const incoming = useOutput(connections, nodes)

  // Assign own output to the node's incoming data
  useEffect(
    () => updateNodeData(id, { output: incoming }),
    [id, incoming, updateNodeData]
  )

  // Return the result node
  return (
    <div className={classNames.join(' ')}>
      <Handle type="target" position={Position.Top} />
      <Title id={id}>🛎️ Result</Title>
      <Pre>{data || 'none'}</Pre>
      <ResultHandles data={data} />
      <Handle
        type="source"
        position={Position.Bottom}
        className={colorMap.result}
      />
    </div>
  )
}

export default ResultNode
