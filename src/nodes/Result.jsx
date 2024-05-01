import {
  Handle,
  Position,
  useHandleConnections,
  useNodesData,
  useReactFlow,
} from '@xyflow/react'
import classNames from './classNames'
import { useEffect } from 'react'

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

  // prepare data to be emitted from source node
  const sourceData = nodesData?.map(nodeData => nodeData?.data?.response)

  // update the node data FIXME: infinite loop
  // useEffect(() => {
  //   console.log('sourceData', sourceData)
  //   updateNodeData(id, { sourceData })
  // }, [id, sourceData, updateNodeData])

  return (
    <div className={classNames.join(' ')}>
      <div>Result node [{id}]</div>
      <Handle type="target" position={Position.Top} />
      <pre>{JSON.stringify(nodesData, null, 2) || 'none'}</pre>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default ResultNode
