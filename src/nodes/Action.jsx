import {
  Handle,
  Position,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react'
import { useContext, useState } from 'react'
import { SocketContext } from '../Socket'
import classNames from './classNames'

const ActionNode = ({ id, data }) => {
  // track the response
  const [response, setResponse] = useState(null)

  // get a handle on the websocket
  const socket = useContext(SocketContext)

  // Get all connections that are connected to this node
  const connections = useHandleConnections({
    type: 'target',
  })

  // Get the data of all nodes that are connected to this node
  const nodesData = useNodesData(
    connections.map(connection => connection.source)
  )

  // Extracts the tool from incoming nodes
  const tool = nodesData?.find(nodeData => nodeData?.data?.tool !== undefined)
    ?.data?.tool

  // Extracts the args from incoming nodes
  const args = nodesData?.find(nodeData => nodeData?.data?.args !== undefined)
    ?.data?.args

  // prepare emission
  const emission = { tool, args }

  // handle the click event
  const handleClick = () => {
    // emit the event to the server
    socket.emit('action', emission, response => {
      console.log('response', response)
      // update the node data
      setResponse(response)
    })
  }

  return (
    <div className={classNames.join(' ')}>
      <div>Action node [{id}]</div>
      <Handle type="target" position={Position.Top} />
      <pre>{JSON.stringify(emission, null, 2) || 'none'}</pre>
      <button
        className="bg-[#444] text-white px-2 py-1 rounded text-left"
        onClick={handleClick}>
        run: {`${tool}('${args}')`}
      </button>
      <pre className="text-xs leading-none overflow-auto max-h-36">
        response: {JSON.stringify(response, null, 2) || 'none'}
      </pre>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default ActionNode
