import {
  Handle,
  Position,
  useHandleConnections,
  useNodesData,
  useReactFlow,
} from '@xyflow/react'
import { useContext } from 'react'
import { SocketContext } from '../Socket'

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
  const schemaId = nodesData?.find(
    nodeData => nodeData.data.schemaId !== undefined
  )?.data.schemaId

  // prepare emission
  const emission = { content: incomingText, schemaId }

  // handle the click event
  const handleClick = () => {
    // emit the event to the server
    socket.emit('message', { content: incomingText, schemaId }, response => {
      console.log('response', response)
      // update the node data
      updateNodeData(id, { text: JSON.stringify(response, null, 2) })
    })
  }

  const classNames = [
    'text-xs',
    'border',
    'border-[#444]',
    'px-2',
    'py-3',
    'text-white',
    'bg-[#222]',
    'rounded',
    'hover:border-[#666]',
  ]

  return (
    <div className={classNames.join(' ')}>
      <Handle type="target" position={Position.Top} />
      <div>Emission node [{id}]</div>
      <pre>{JSON.stringify(emission, null, 2)}</pre>
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
