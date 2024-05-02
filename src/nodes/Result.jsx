import {
  Handle,
  Position,
  useHandleConnections,
  useNodesData,
  useReactFlow,
} from '@xyflow/react'
import classNames from './classNames'

import Pre from '../components/Pre'
import Title from '../components/Title'
import { useEffect } from 'react'
import { useResult } from '../hooks'

const ResultNode = ({ id, data }) => {
  // get a handle on the updateNodeData function
  const { updateNodeData } = useReactFlow()

  // Get all connections that are connected to this node
  const connections = useHandleConnections({
    type: 'target',
  })

  // Get the data of all nodes that are connected to this node
  const nodesData = useNodesData(
    connections.map(connection => connection.source)
  )

  // Get the result from the connected nodes
  const result = useResult(connections, nodesData)

  // Assign the result to the result node's data
  useEffect(() => {
    updateNodeData(id, { result })
  }, [id, result, updateNodeData])

  // Return the result node
  return (
    <div className={classNames.join(' ')}>
      <Title id={id}>Result</Title>
      <Handle type="target" position={Position.Top} />
      <Pre>{data?.result || 'none'}</Pre>
    </div>
  )
}

export default ResultNode
