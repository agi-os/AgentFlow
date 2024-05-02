import toolPresets from './presets/tools.json'

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

import { useCallback } from 'react'
import { Position, Handle, useReactFlow } from '@xyflow/react'
import classNames from './classNames'
import Title from '../components/Title'
import Pre from '../components/Pre'
import Inputs from '../components/Inputs'

/**
 * Tool identity node
 * @param {string} id - Node ID
 * @param {object} data - Node data
 * @returns {JSX.Element}
 */
const ToolNode = ({ id, data }) => {
  const handleSelect = event => {
    const tool = toolPresets.find(
      tool => tool.functionName === event.target.value
    )

    if (!tool) return

    updateNodeData(id, {
      functionName: tool.functionName,
      functionDescription: tool.functionDescription,
      propertyName: tool.propertyName,
      propertyType: tool.propertyType,
      propertyDescription: tool.propertyDescription,
      toolSchema: generateToolSchema(tool),
    })
  }

  const { updateNodeData } = useReactFlow()

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

  const inputs = [
    { label: 'Function Name', field: 'functionName' },
    { label: 'Function Description', field: 'functionDescription' },
    { label: 'Parameter Name', field: 'propertyName' },
    { label: 'Parameter Type', field: 'propertyType' },
    { label: 'Parameter Description', field: 'propertyDescription' },
  ]

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
      <Pre>{data.toolSchema}</Pre>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default ToolNode
