import { Handle, Position } from '@xyflow/react'
import { useState, useEffect } from 'react'

const CustomNode = ({ data }) => {
  const [label, setLabel] = useState(data.label)

  useEffect(() => {
    setLabel(data.label)
  }, [data.label])

  const classNames = [
    'text-xs',
    'border',
    'border-gray-700',
    'px-2',
    'py-3',
    'bg-white',
    'rounded',
    'hover:shadow',
  ]

  const handleInputChange = event => {
    setLabel(event.target.value)
    data.label = event.target.value // write back to data
  }

  return (
    <div className={classNames.join(' ')}>
      {label && <div>{label}</div>}
      <input
        className="w-full p-1 border border-gray-400 rounded"
        value={label}
        onChange={handleInputChange}
      />

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default CustomNode
