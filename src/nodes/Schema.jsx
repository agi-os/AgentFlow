import { Handle, Position } from '@xyflow/react'
import { useState, useEffect } from 'react'

const SchemaNode = ({ id, data }) => {
  const [schema, setSchema] = useState(data.schema)

  useEffect(() => {
    setSchema(data.schema)
  }, [data.schema])

  const classNames = [
    'flex',
    'flex-col',
    'gap-4',
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
      <div>
        Schema node [{id}] [{data.schemaId}]
      </div>
      {Object.keys(schema).map(key => (
        <div key={key} className="grid grid-cols-4 items-center gap-1">
          <div className="col-span-full">{schema[key]._def.description}</div>
          <div className="col-span-1">{key}</div>
          <input className={inputClassNames.join(' ')} placeholder={key} />
        </div>
      ))}
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default SchemaNode
