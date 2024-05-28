import { useCallback } from 'react'
import { useReactFlow } from '@xyflow/react'
import {
  Schemas,
  schemaYaml,
  labelClassNames,
  schemaNodeClassNames,
} from './config'

/**
 * Selector component for selecting a schema name from a list of predefined schemas.
 *
 * @param {string} id - The unique identifier of the component.
 * @param {object} data - The data object containing schema information.
 * @returns {JSX.Element} A div element containing radio buttons for selecting schema names.
 */
const Selector = ({ id, data }) => {
  const { setNodes } = useReactFlow()

  const handleChange = useCallback(
    e => {
      const { value } = e.target

      setNodes(nodes =>
        nodes.map(node =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  schemaName: value,
                  schemaYaml: schemaYaml[value] || '',
                },
              }
            : node
        )
      )
    },
    [id, setNodes]
  )

  return (
    <div x-node-id={id} className={schemaNodeClassNames.join(' ')}>
      {Schemas.map(schema => (
        <label key={schema} className={labelClassNames.join(' ')}>
          <input
            type="radio"
            value={schema}
            checked={schema === data.schemaName || false}
            name="format"
            onChange={handleChange}
          />
          <div>{schema}</div>
        </label>
      ))}
    </div>
  )
}

export default Selector
