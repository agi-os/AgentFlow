import { Handle, Position } from '@xyflow/react'
import { useState, useEffect } from 'react'
import classNames from './classNames'

const SchemaNode = ({ id, data }) => {
  const [schema, setSchema] = useState(data.schemaJson)

  useEffect(() => {
    setSchema(data.schema)
  }, [data.schema])

  const inputClassNames = [
    'w-full',
    'p-1',
    'border',
    'border-[#222]',
    'bg-[#111]',
    'col-span-3',
    'rounded',
  ]

  return (
    <div className={classNames.join(' ')}>
      <div>Schema node [{id}]</div>
      <pre className="text-xs leading-none overflow-auto max-h-36">
        {JSON.stringify(data, null, 2)}
      </pre>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default SchemaNode
