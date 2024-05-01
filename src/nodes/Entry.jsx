import { useCallback } from 'react'
import { Position, Handle, useReactFlow } from '@xyflow/react'
import Input from '../components/Input'
import classNames from './classNames'
import Title from '../components/Title'

/**
 * Text entry node
 * @param {string} id - Node ID
 * @param {object} data - Node data
 * @returns {JSX.Element}
 */
const EntryNode = ({ id, data }) => {
  const { updateNodeData } = useReactFlow()

  const onChange = useCallback(
    text => {
      updateNodeData(id, { text })
    },
    [id, updateNodeData]
  )

  return (
    <div className={classNames.join(' ')}>
      <Title id={id}>Entry node</Title>
      <Input
        onChange={event => onChange(event.target.value)}
        text={data.text}
      />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default EntryNode
