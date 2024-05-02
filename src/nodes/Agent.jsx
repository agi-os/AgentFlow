import { useCallback } from 'react'
import { Position, Handle, useReactFlow } from '@xyflow/react'
import Input from '../components/Input'
import classNames from './classNames'
import Title from '../components/Title'
import Pre from '../components/Pre'

const Inputs = ({ inputs, data, onChange }) =>
  inputs.map(({ label, field }) => (
    <Input
      key={field}
      label={label}
      text={data[field]}
      onChange={event => onChange({ value: event.target.value, field })}
    />
  ))

/**
 * Text entry node
 * @param {string} id - Node ID
 * @param {object} data - Node data
 * @returns {JSX.Element}
 */
const AgentNode = ({ id, data }) => {
  const { updateNodeData } = useReactFlow()

  const onChange = useCallback(
    ({ value, field }) => {
      updateNodeData(id, { [field]: value })
    },
    [id, updateNodeData]
  )

  const inputs = [
    { label: 'Name', field: 'name' },
    { label: 'Text', field: 'text' },
  ]

  return (
    <div className={classNames.join(' ')}>
      <Title id={id}>Agent</Title>
      <Inputs inputs={inputs} data={data} onChange={onChange} />
      <Pre>{data}</Pre>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default AgentNode
