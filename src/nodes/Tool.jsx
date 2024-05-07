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
import {
  Position,
  Handle,
  useReactFlow,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react'
import classNames from '../constants/classNames'
import Title from '../components/Title'
import Inputs from '../components/Inputs'
import { SocketContext } from '../Socket'
import ResultHandles from './ResultHandles'
import colorMap from '../constants/colorMap'
import useOutput from '../hooks/useOutput'

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
  // Get the socket from the context
  const socket = useContext(SocketContext)

  // List of tools available in form of presets
  const [toolPresets, setTools] = useState([])

  // Schema of the currently configured tool
  const [toolSchema, setToolSchema] = useState({})

  // On any change of tool data, update the tool schema
  useEffect(() => {
    setToolSchema(
      generateToolSchema({
        functionName: data.functionName,
        functionDescription: data.functionDescription,
        propertyName: data.propertyName,
        propertyType: data.propertyType,
        propertyDescription: data.propertyDescription,
      })
    )
  }, [
    data.functionName,
    data.functionDescription,
    data.propertyName,
    data.propertyType,
    data.propertyDescription,
  ])

  const { updateNodeData } = useReactFlow()

  // Fetch the tool schemas from the server
  useEffect(() => {
    socket.emit('tool schemas', tools => {
      const data = tools.map(tool => reverseToolSchema(tool))
      setTools(data)
    })
  }, [socket])

  // On any tool schema change, update the node output schema
  // Assign own output to the node's incoming data
  useEffect(
    () =>
      updateNodeData(id, {
        output: toolSchema,
      }),
    [id, toolSchema, updateNodeData]
  )

  // Update the node data with the selected tool when a preset is selected
  const handleSelect = event => {
    // Find the tool with the selected function name
    const tool = toolPresets.find(
      tool => tool.functionName === event.target.value
    )

    // If the tool is not found, return
    if (!tool) return

    // Update the node data with the selected tool's data
    updateNodeData(id, tool)
  }

  // Handle the change of the input fields
  const onChange = useCallback(
    ({ value, field }) => updateNodeData(id, { [field]: value }),
    [id, updateNodeData]
  )

  // Return the JSX
  return (
    <div className={classNames.join(' ')}>
      <Handle type="target" position={Position.Top} />
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
      <Handle
        type="source"
        position={Position.Bottom}
        className={colorMap.tool}
      />
    </div>
  )
}

export default ToolNode
