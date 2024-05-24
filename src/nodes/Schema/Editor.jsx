import { useCallback } from 'react'
import { useReactFlow } from '@xyflow/react'
import { textAreaClassNames } from './config'

/**
 * Editor component for rendering a textarea input with specific styling and functionality.
 *
 * @param {string} id - The unique identifier for the editor component.
 * @param {object} data - The data object containing the schemaYaml value to be displayed in the textarea.
 * @returns {JSX.Element} A textarea element with custom styling and onChange event handler.
 */
const Editor = ({ id, data }) => {
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
                  schemaYaml: value,
                },
              }
            : node
        )
      )
    },
    [id, setNodes]
  )

  return (
    <textarea
      x-id={id}
      spellCheck={false}
      onChange={handleChange}
      className={textAreaClassNames.join(' ')}
      value={data.schemaYaml}
    />
  )
}

export default Editor
