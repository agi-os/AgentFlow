const generateToolSchema = ({
  functionName,
  functionDescription,
  propertyName,
  propertyType,
  propertyDescription,
}) => {
  return {
    type: 'function',
    function: {
      name: functionName,
      description: functionDescription,
      parameters: {
        type: 'object',
        properties: {
          [propertyName]: {
            type: propertyType,
            description: propertyDescription,
          },
        },
        required: [propertyName],
      },
    },
  }
}

const reverseToolSchema = schema => {
  const functionName = schema.function.name
  const functionDescription = schema.function.description
  const propertyName = Object.keys(schema.function.parameters.properties)[0]
  const propertyType = schema.function.parameters.properties[propertyName].type
  const propertyDescription =
    schema.function.parameters.properties[propertyName].description

  return {
    functionName,
    functionDescription,
    propertyName,
    propertyType,
    propertyDescription,
  }
}

import { useCallback, useContext, useEffect, useState } from 'react'
import { Position, Handle, useReactFlow } from '@xyflow/react'
import classNames from './classNames'
import Title from '../components/Title'
import Pre from '../components/Pre'
import Inputs from '../components/Inputs'
import { SocketContext } from '../Socket'

/**
 * List of inputs for the tool node
 */
const inputs = [
  { label: 'Function Name', field: 'functionName' },
  { label: 'Function Description', field: 'functionDescription' },
  { label: 'Parameter Name', field: 'propertyName' },
  { label: 'Parameter Type', field: 'propertyType' },
  { label: 'Parameter Description', field: 'propertyDescription' },
]

/**
 * Tool identity node
 * @param {string} id - Node ID
 * @param {object} data - Node data
 * @returns {JSX.Element}
 */
const ToolNode = ({ id, data }) => {
  const { updateNodeData } = useReactFlow()

  // Get the socket from the context
  const socket = useContext(SocketContext)

  // List of tools available in form of presets
  const [toolPresets, setTools] = useState([])

  // Fetch the tool schemas from the server
  useEffect(() => {
    socket.emit('tool schemas', tools => {
      const data = tools.map(tool => reverseToolSchema(tool))
      setTools(data)
    })
  }, [socket])

  // Update the node data with the selected tool when a preset is selected
  const handleSelect = event => {
    // Find the tool with the selected function name
    const tool = toolPresets.find(
      tool => tool.functionName === event.target.value
    )

    // If the tool is not found, return
    if (!tool) return

    // Update the node data with the selected tool
    updateNodeData(id, {
      functionName: tool.functionName,
      functionDescription: tool.functionDescription,
      propertyName: tool.propertyName,
      propertyType: tool.propertyType,
      propertyDescription: tool.propertyDescription,
      toolSchema: generateToolSchema(tool),
    })
  }

  // Handle the change of the input fields
  const onChange = useCallback(
    ({ value, field }) => {
      // Parse the data and update the tool schema
      const toolSchema = generateToolSchema({
        ...data,
        [field]: value,
      })

      // Update the node data
      updateNodeData(id, { toolSchema, [field]: value })
    },
    [data, id, updateNodeData]
  )

  // Return the JSX
  return (
    <div className={classNames.join(' ')}>
      <Title id={id}>🛠️ Tool</Title>
      <div className="pl-2 -mb-3 text-slate-300 text-xs">Presets</div>
      <select
        value={data.functionName}
        className="appearance-none  bg-zinc-900 text-white rounded-full p-2 pl-3 border border-zinc-700 outline-none"
        onChange={handleSelect}>
        <option value="">Select a preset</option>
        {toolPresets.map((tool, index) => (
          <option key={index} value={tool.functionName}>
            {tool.functionName}
          </option>
        ))}
      </select>
      <Inputs inputs={inputs} data={data} onChange={onChange} />
      {/* <Pre>{data.toolSchema}</Pre> */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default ToolNode
