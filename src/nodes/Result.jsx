import {
  Handle,
  Position,
  useHandleConnections,
  useNodesData,
  useReactFlow,
} from '@xyflow/react'
import classNames from './classNames'

import Pre from '../components/Pre'

const ResultNode = ({ id }) => {
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

  // merge all data objects from nodesData
  const mergedData = nodesData.reduce((acc, nodeData) => {
    return { ...acc, ...nodeData?.data }
  }, {})

  return (
    <div className={classNames.join(' ')}>
      <div>Result node [{id}]</div>
      <Handle type="target" position={Position.Top} />
      <Pre>{mergedData}</Pre>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default ResultNode
