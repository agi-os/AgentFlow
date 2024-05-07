import {
  Handle,
  Position,
  useHandleConnections,
  useNodesData,
  useReactFlow,
} from '@xyflow/react'
import { useContext } from 'react'
import { SocketContext } from '../Socket'
import classNames from '../constants/classNames'
import Title from '../components/Title'

const ActionNode = ({ id, data }) => {
  // get a handle on the updateNodeData function
  const { updateNodeData } = useReactFlow()

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

  // prepare emission
  const emission = { tool: null, args: null }

  // Extracts the function name from incoming nodes
  const functionName = nodesData?.find(
    nodeData => nodeData?.data?.target?.function !== undefined
  )?.data?.target?.function

  emission.tool = functionName

  // Extracts the first argument from incoming nodes
  const firstArg = nodesData?.find(
    nodeData => nodeData?.data?.target?.arguments !== undefined
  )?.data?.target?.arguments

  // If arguments exist and it's an object, get the first argument
  if (typeof firstArg === 'object' && firstArg !== null) {
    const firstArgKey = Object.keys(firstArg)[0]
    const firstArgValue = firstArg[firstArgKey]

    emission.args = firstArgValue
  }

  // handle the click event
  const handleClick = () => {
    // emit the event to the server
    socket.emit('action', emission, response => {
      console.log('response', response)
      // update the node data
      updateNodeData(id, { response })
    })
  }

  // If a response is an array, create Handles for all elements in Right position
  const ResponseHandles = () => {
    // If response is not defined, abort
    if (!data.response) return null

    // If response is not an array, abort
    if (!Array.isArray(data.response)) return null

    // If response is an array, create Handles for all elements in Right position
    return data.response?.map((response, index, array) => {
      const offset = (index / (array.length - 1)) * 100
      return (
        <Handle
          key={index}
          type="source"
          position={Position.Right}
          id={`response-${index}`}
          style={{ top: `${offset}%` }}
        />
      )
    })
  }

  return (
    <div className={classNames.join(' ')}>
      <Title id={id}>🐣 Action</Title>
      <Handle type="target" position={Position.Top} />
      <pre>{JSON.stringify(emission, null, 2) || 'none'}</pre>
      <button
        className="bg-[#444] text-white px-2 py-1 rounded text-left"
        onClick={handleClick}>
        run: {`${emission.tool}('${emission.args}')`}
      </button>
      <pre className="text-xs leading-none overflow-auto max-h-36">
        response: {JSON.stringify(data.response, null, 2) || 'none'}
      </pre>
      <Handle type="source" position={Position.Bottom} />
      <ResponseHandles />
    </div>
  )
}

export default ActionNode
