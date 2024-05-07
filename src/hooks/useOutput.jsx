import { useState, useEffect } from 'react'

/**
 * Retrieves the output from the connected nodes
 * @param {object[]} connections - List of connections
 * @param {object[]} nodes - List of nodes
 * @param {object} options - Options object
 * @param {string} [options.nodeKey='response'] - Key to extract the response from the node data
 * @returns {object} - Object from the node key
 */
const useOutput = ( { nodeKey = 'output' } = {}) => {

  // Initialize output state as an array
  const [output, setOutput] = useState([])

  // Get a handle on the updateNodeData function
  const { updateNodeData } = useReactFlow()

  // Get all connections that are connected to this node
  const connections = useHandleConnections({ type: 'target' })

  // Use an effect to update the output whenever connections, nodes, or nodeKey change
  useEffect(() => {
    // If there are no connections, set the output to an empty array
    if (!connections || connections.length === 0) {
      setOutput([])
      return
    }

    // Map over the connections to generate an array of outputs in buckets by type of node
    const outputs = connections.reduce((acc, connection) => {
      // Find the node for the source of the connection
      const node = nodes.find(node => node.id === connection.source)

      // Extract the node data and type from the node
      const { data: nodeData, type } = node

      // If the node data is not found, abort
      if (typeof nodeData === 'undefined') return acc

      // Get the response from the node data
      const response = nodeData[nodeKey]

      // Get the source handle of the connection
      const sourceHandle = connection?.sourceHandle

      // If we do not have a source handle, add the full response to its type bucket
      if (!sourceHandle) {
        if (!acc[type]) acc[type] = []
        acc[type].push(response)
        return acc
      }

      // Extract the index from sourceHandle (e.g. 'name-0' -> 0)
      const sourceHandleIndex = connection?.sourceHandle?.split('-')[1]

      // If the response is not an array, return the accumulated object
      if (typeof response !== 'object' || !Array.isArray(response)) return acc

      // Add the output for this connection to its type bucket
      if (!acc[type]) acc[type] = []
      acc[type].push(response[sourceHandleIndex])

      return acc
    }, {})

    // Set the output state to the object of outputs
    setOutput(outputs)
  }, [connections, nodeKey, nodes])

  // Return the output
  return output
}

export default useOutput
