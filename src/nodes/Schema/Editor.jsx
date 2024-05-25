import { useCallback } from 'react'
import { useReactFlow, useStore } from '@xyflow/react'
import { textAreaClassNames, buttonClassNames } from './config'

/**
 * Writes the schema for the user using LLM help
 */
const writeYamlForMe = (e, socket, handleChange) => {
  e.preventDefault()
  e.stopPropagation()

  const whatUserWants = prompt(
    "I'm here to help, please tell me a little about the data you wish to get in each result?"
  )

  // Abort if user cancelled or entered blank value
  if (!whatUserWants) {
    return
  }

  // Send request to server
  socket.emit(
    'llmSchema',
    {
      preset: 'createYamlSchema',
      content: whatUserWants,
    },
    response => {
      const { yamlSchemaString } = response

      // Skip first line as it is always the same
      const trimmedYamlSchemaString = yamlSchemaString
        .split('\n')
        .slice(1)
        .join('\n')

      handleChange({ target: { value: trimmedYamlSchemaString } })
    }
  )
}

/**
 * Editor component for rendering a textarea input with specific styling and functionality.
 *
 * @param {string} id - The unique identifier for the editor component.
 * @param {object} data - The data object containing the schemaYaml value to be displayed in the textarea.
 * @returns {JSX.Element} A textarea element with custom styling and onChange event handler.
 */
const Editor = ({ id, data }) => {
  const { setNodes } = useReactFlow()
  const socket = useStore(s => s.socket)

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
    <>
      <textarea
        x-id={id}
        spellCheck={false}
        onChange={handleChange}
        className={textAreaClassNames.join(' ')}
        value={data.schemaYaml}
      />
      <button
        className={buttonClassNames.join(' ')}
        onClick={e => writeYamlForMe(e, socket, handleChange)}>
        ✨
      </button>
    </>
  )
}

export default Editor
