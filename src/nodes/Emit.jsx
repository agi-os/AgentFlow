import {
  Handle,
  Position,
  useHandleConnections,
  useNodesData,
  useReactFlow,
} from '@xyflow/react'
import { useContext } from 'react'
import { SocketContext } from '../Socket'
import classNames from './classNames'
import Title from '../components/Title'
import Pre from '../components/Pre'

const EmitNode = ({ id }) => {
  // get a handle on the websocket
  const socket = useContext(SocketContext)

  const { updateNodeData } = useReactFlow()

  const connections = useHandleConnections({
    type: 'target',
  })

  const nodesData = useNodesData(
    connections.map(connection => connection.source)
  )

  // get the data from the first node data text available
  const incomingText = nodesData?.find(
    nodeData => nodeData.data.text !== undefined
  )?.data.text

  // get the schemaId from the first node data schemaId available
  const schema = nodesData?.find(nodeData => nodeData.data.schema !== undefined)
    ?.data.schema

  // prepare emission
  const emission = { content: incomingText, schemaJson: schema }

  // handle the click event
  const handleClick = () => {
    // emit the event to the server
    socket.emit('message', emission, response => {
      console.log('response', response)
      // update the node data
      updateNodeData(id, {
        text: JSON.stringify(response, null, 2),
        tool: response.tool,
        args: response.args,
      })
    })
  }

  return (
    <div className={classNames.join(' ')}>
      <Handle type="target" position={Position.Top} />
      <Title id={id}>Emission node</Title>
      <Pre>{emission}</Pre>
      <button
        className="bg-[#444] text-white px-2 py-1 rounded text-left"
        onClick={handleClick}>
        emit
      </button>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default EmitNode
