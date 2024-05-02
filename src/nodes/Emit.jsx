import { useCallback, useMemo, useState } from 'react'
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

// Function to find the first node data based on a given property
const findFirstNodeData = (nodesData, property) => {
  return nodesData?.find(nodeData => nodeData.data[property] !== undefined)
    ?.data[property]
}

const EmitNode = ({ id, data }) => {
  // loading state
  const [isLoading, setIsLoading] = useState(false)

  // get a handle on the websocket
  const socket = useContext(SocketContext)

  // get a handle on the updateNodeData function
  const { updateNodeData } = useReactFlow()

  // Get all connections that are connected to this node
  const connections = useHandleConnections({
    type: 'target',
  })

  // Get the data of all nodes that are connected to this node
  const nodesData = useNodesData(
    connections.map(connection => connection.source)
  )

  // Get incoming text and schema
  const incomingText = findFirstNodeData(nodesData, 'text')
  const incomingSchema = findFirstNodeData(nodesData, 'schema')

  // Prepare emission
  const emission = useMemo(
    () => ({ content: incomingText, schemaJson: incomingSchema }),
    [incomingText, incomingSchema]
  )

  // Handle the click event
  const handleClick = useCallback(() => {
    setIsLoading(true)
    // emit the event to the server
    socket.emit('message', emission, response => {
      console.log('response', response)
      // update the node data, adding to the results array
      const results = data?.results || []
      results.push(response)

      updateNodeData(id, {
        results,
        tool: response.tool,
        args: response.args,
      })

      setIsLoading(false)
    })
  }, [data?.results, emission, id, socket, updateNodeData])

  const ResultGrid = () => (
    <div
      className="grid w-full gap-2"
      style={{
        gridTemplateColumns: `repeat(${data?.results?.length}, 1fr)`,
      }}>
      {data?.results?.map((result, index) => (
        <Pre key={index}>{result}</Pre>
      ))}
    </div>
  )

  const ResultHandles = () =>
    data?.results?.map((result, index) => (
      <Handle
        key={index}
        type="source"
        position={Position.Bottom}
        id={`result-${index}`}
        style={{ left: `${((index + 0.5) / data.results.length) * 100}%` }}
      />
    ))

  const Button = () => (
    <button
      className="bg-[#444] text-white p-2 rounded-full"
      onClick={() => (isLoading ? null : handleClick())}>
      {isLoading ? 'Loading...' : 'Emit'}
    </button>
  )

  return (
    <div className={classNames.join(' ')}>
      <Handle type="target" position={Position.Top} />
      <Title id={id}>Emission</Title>
      <Pre>{emission}</Pre>
      <Button />
      <ResultGrid />
      <ResultHandles />
    </div>
  )
}

export default EmitNode
