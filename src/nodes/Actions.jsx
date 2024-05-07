import {
  Handle,
  Position,
  useHandleConnections,
  useNodesData,
  useReactFlow,
} from '@xyflow/react'
import { useEffect, useMemo, useContext } from 'react'
import { SocketContext } from '../Socket'
import classNames from '../constants/classNames'
import Title from '../components/Title'
import Pre from '../components/Pre'
import { useResult } from '../hooks'

const ActionsNode = ({ id, data }) => {
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

  // Get the result from the connected nodes
  const result = useResult(connections, nodesData)

  // Assign the result to the result node's data
  useEffect(() => {
    updateNodeData(id, { result })
  }, [id, result, updateNodeData])

  const emission = { tool: data?.result?.tool, args: data?.result?.args }

  // handle the click event
  const handleClick = () => {
    // emit the event to the server
    socket.emit('action', emission, response => {
      console.log('response', response)
      // update the node data
      updateNodeData(id, { response })
    })
  }

  return (
    <div className={classNames.join(' ')}>
      <Title id={id}>Actions</Title>
      <Handle type="target" position={Position.Top} />
      <Pre>{data}</Pre>
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
    </div>
  )
}

export default ActionsNode
