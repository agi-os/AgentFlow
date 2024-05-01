import {
  Handle,
  Position,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react'
import classNames from './classNames'

const ResultNode = ({ id }) => {
  // Get all connections that are connected to this node
  const connections = useHandleConnections({
    type: 'target',
  })

  // Get the data of all nodes that are connected to this node
  const nodesData = useNodesData(
    connections.map(connection => connection.source)
  )

  return (
    <div className={classNames.join(' ')}>
      <div>Result node [{id}]</div>
      <Handle type="target" position={Position.Top} />
      <pre>
        incoming texts:{' '}
        {nodesData
          ?.filter(nodeData => nodeData?.data?.text !== undefined)
          .map(({ data }, i) => <div key={i}>{data.text}</div>) || 'none'}
      </pre>
    </div>
  )
}

export default ResultNode
