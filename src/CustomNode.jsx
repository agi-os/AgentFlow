import {
  Handle,
  Position,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react'
import { useState, useEffect } from 'react'

const CustomNode = ({ data }) => {
  const [label, setLabel] = useState(data.label)

  const connections = useHandleConnections({
    type: 'target',
  })
  const nodesData = useNodesData(
    connections.map(connection => connection.source)
  )

  useEffect(() => {
    setLabel(data.label)
  }, [data.label])

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

  const handleInputChange = event => {
    setLabel(event.target.value)
    data.label = event.target.value // write back to data
  }

  return (
    <div className={classNames.join(' ')}>
      {label && <div>{label}</div>}
      <input
        className="w-full p-1 border border-[#222] bg-[#111] rounded"
        value={label}
        onChange={handleInputChange}
      />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default CustomNode
