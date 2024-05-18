import { useCallback } from 'react'
import { addEdge, useStore } from '@xyflow/react'

/**
 * Retrieves the source and target nodes of a connection.
 * @param {Object} connection - The connection object.
 * @param {Function} lookup - The lookup function to retrieve a node by ID.
 * @returns {Object} - An object containing the source and target nodes.
 */
const getNodes = (connection, lookup) => {
  return {
    sourceNode: lookup(connection.source),
    targetNode: lookup(connection.target),
  }
}

/**
 * Sets the connection type and animation based on the source and target types.
 * @param {object} connection - The connection object.
 * @param {string} sourceType - The source type.
 * @param {string} targetType - The target type.
 */
const setConnectionTypeAndAnimation = (connection, sourceType, targetType) => {
  if (
    (sourceType === 'inputPortal' && targetType === 'outputPortal') ||
    (sourceType === 'outputPortal' && targetType === 'inputPortal')
  ) {
    connection.type = 'default'
    connection.animated = true
  }

  if (
    connection.sourceHandle === 'outbox' &&
    connection.targetHandle === 'inbox'
  ) {
    connection.type = 'queue'
    connection.animated = true
  }

  if (
    connection.sourceHandle === 'inbox' &&
    connection.targetHandle === 'outbox'
  ) {
    connection.type = 'queue'
    connection.animated = true
  }
}

/**
 * Reverses the connection by swapping the source and target properties.
 * If the source type is 'outputPortal' or the source handle is 'inbox', the source and target properties are swapped along with their respective handles.
 * @param {Object} connection - The connection object to be reversed.
 * @param {string} sourceType - The type of the source.
 * @returns {Object} - The reversed connection object.
 */
const reverseConnection = (connection, sourceType) => {
  if (sourceType === 'outputPortal' || connection.sourceHandle === 'inbox') {
    return {
      ...connection,
      source: connection.target,
      sourceHandle: connection.targetHandle,
      target: connection.source,
      targetHandle: connection.sourceHandle,
    }
  }

  return connection
}

/**
 * Logs a warning if either the source node or the target node is not found.
 * @param {HTMLElement} sourceNode - The source node.
 * @param {HTMLElement} targetNode - The target node.
 */
const warnIfNodesNotFound = (sourceNode, targetNode) => {
  if (!sourceNode || !targetNode) {
    console.warn('source or target node not found', {
      sourceNode,
      targetNode,
    })
  }
}

/**
 * Handles the onConnect event when a connection is made between nodes.
 * @param {Object} params - The parameters for the onConnect event.
 * @param {Object} params.connection - The connection object representing the connection made.
 * @param {Object} params.storeApi - The store API object.
 * @param {Function} params.setEdges - The function to update the edges state.
 */
const onConnect = ({ connection, lookup, generateId, setEdges }) => {
  connection.id = generateId()
  connection.type = 'default'

  // Get the source and target nodes
  const { sourceNode, targetNode } = getNodes(connection, lookup)

  // Log a warning if either the source or target node is not found
  warnIfNodesNotFound(sourceNode, targetNode)

  if (sourceNode && targetNode) {
    const sourceType = sourceNode?.type
    const targetType = targetNode?.type

    setConnectionTypeAndAnimation(connection, sourceType, targetType)
    connection = reverseConnection(connection, sourceType)
  }

  setEdges(edges => addEdge(connection, edges))
}

/**
 * Custom hook that returns a memoized version of the onConnect function.
 * @param {Object} storeApi - The store API object.
 * @param {Function} setEdges - The function to update the edges state.
 * @returns {Function} - The memoized onConnect function.
 */
const useOnConnect = setEdges => {
  // Get lookup and generateId functions from the store
  const lookup = useStore(state => state.lookup)
  const generateId = useStore(state => state.generateId)

  return useCallback(
    connection => onConnect({ connection, lookup, generateId, setEdges }),
    [lookup, generateId, setEdges]
  )
}

export default useOnConnect
