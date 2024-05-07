import { useCallback, useEffect, useMemo, useState } from 'react'
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
import Pre from '../components/Pre'
import useOutput from '../hooks/useOutput'

const WorkbenchNode = ({ id, data }) => {
  // Get a handle on the updateNodeData function
  const { updateNodeData } = useReactFlow()

  // Get all connections that are connected to this node
  const connections = useHandleConnections({ type: 'target' })

  // Get all nodes that are connected to this node
  const nodes = useNodesData(connections.map(connection => connection.source))

  // Get the target values
  const target = useOutput(connections, nodes)

  // Assign data.target to the node's target data
  useEffect(() => updateNodeData(id, { target }), [id, target, updateNodeData])

  // loading state
  const [isLoading, setIsLoading] = useState(false)

  // get a handle on the websocket
  const socket = useContext(SocketContext)

  // Attempt to extract data from target nodes
  const { entry, schema, tool } = data?.target || {}

  // Get incoming entry
  const incomingText = useMemo(
    () => (Array.isArray(entry) && entry.length > 0 ? entry[0] : null),
    [entry]
  )

  // Get incoming schema
  const incomingSchema = useMemo(
    () =>
      Array.isArray(schema) && schema.length > 0 ? schema[0]?.output : null,
    [schema]
  )

  // Prepare emission on any change of incoming data
  useEffect(() => {
    const emission = {
      content: incomingText,
      schemaJson: incomingSchema,
      tools: tool,
    }

    updateNodeData(id, { emission })
  }, [id, incomingText, incomingSchema, tool, updateNodeData])

  // Handle the click event
  const handleClick = useCallback(() => {
    setIsLoading(true)

    // if we have a tool in emission, emit a tool event
    const emissionType = data?.emission?.tools?.length > 0 ? 'tool' : 'message'

    // emit to the server
    socket.emit(emissionType, data.emission, response => {
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
  }, [data?.results, data.emission, id, socket, updateNodeData])

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
      className="bg-zinc-900 text-white p-2 rounded-full"
      onClick={() => (isLoading ? null : handleClick())}>
      {isLoading ? '⚙️ Working...' : '👟 Run'}
    </button>
  )

  return (
    <div className={classNames.join(' ')}>
      <Handle type="target" position={Position.Top} />
      <Title id={id}>🏗️ Workbench</Title>
      <Pre>{data.target}</Pre>
      <hr className="border border-zinc-700" />
      <Pre>{data.emission}</Pre>
      <Button />
      <ResultGrid />
      <ResultHandles />
    </div>
  )
}

export default WorkbenchNode
