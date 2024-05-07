import { useCallback, useEffect } from 'react'
import {
  Position,
  Handle,
  useReactFlow,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react'
import Input from '../components/Input'
import classNames from '../constants/classNames'
import Title from '../components/Title'
import Pre from '../components/Pre'

import useOutput from '../hooks/useOutput'
import ResultHandles from './ResultHandles'
import colorMap from '../constants/colorMap'

/**
 * Text entry node
 * @param {string} id - Node ID
 * @param {object} data - Node data
 * @returns {JSX.Element}
 */
const EntryNode = ({ id, data }) => {
  const { updateNodeData } = useReactFlow()

  const onChange = useCallback(
    event => updateNodeData(id, { output: event.target.value }),
    [id, updateNodeData]
  )

  return (
    <div className={classNames.join(' ')}>
      <Handle type="target" position={Position.Top} />
      <Title id={id}>✏️ Entry</Title>
      <Input onChange={onChange} text={data.output} />
      <Handle
        type="source"
        position={Position.Bottom}
        className={colorMap.entry}
      />
    </div>
  )
}

export default EntryNode
