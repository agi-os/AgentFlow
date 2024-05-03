import { useCallback, useEffect } from 'react'
import {
  Position,
  Handle,
  useReactFlow,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react'
import Input from '../components/Input'
import classNames from './classNames'
import Title from '../components/Title'
import Pre from '../components/Pre'

import { useResult } from '../hooks'

/**
 * Text entry node
 * @param {string} id - Node ID
 * @param {object} data - Node data
 * @returns {JSX.Element}
 */
const EntryNode = ({ id, data }) => {
  const { updateNodeData } = useReactFlow()

  // Get all connections that are connected to this node
  const connections = useHandleConnections({
    type: 'target',
  })

  // Get the data of all nodes that are connected to this node
  const nodesData = useNodesData(
    connections.map(connection => connection.source)
  )

  // Extract the text from the incoming nodes
  const result = useResult(connections, nodesData)

  // Defines if we have any incoming connections
  const hasTargetConnections = connections.length > 0

  // Update the node data with nodesData
  useEffect(() => {
    console.log({ result })
    updateNodeData(id, { target: result })
  }, [id, updateNodeData, result])

  const onChange = useCallback(
    text => {
      updateNodeData(id, { text })
    },
    [id, updateNodeData]
  )

  return (
    <div className={classNames.join(' ')}>
      <Handle type="target" position={Position.Top} />
      <Title id={id}>✏️ Entry</Title>
      {hasTargetConnections ? (
        <Pre>{data}</Pre>
      ) : (
        <Input
          onChange={event => onChange(event.target.value)}
          text={data.text}
        />
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default EntryNode
