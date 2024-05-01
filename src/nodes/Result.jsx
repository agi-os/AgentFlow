import {
  Handle,
  Position,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react'

const ResultNode = ({ id }) => {
  const connections = useHandleConnections({
    type: 'target',
  })
  const nodesData = useNodesData(
    connections.map(connection => connection.source)
  )

  const classNames = [
    'text-xs',
    'border',
    'border-[#444]',
    'px-2',
    'py-3',
    'text-white',
    'bg-[#222]',
    'rounded',
    'hover:border-[#666]',
  ]

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
