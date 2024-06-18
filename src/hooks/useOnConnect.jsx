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
 * Checks if a connection is a transport connection based on the source and target handles.
 * A connection is considered a transport connection if the source handle starts with 'outbox'
 * and the target handle starts with 'inbox', or if the source handle starts with 'inbox'
 * and the target handle starts with 'outbox'.
 *
 * @param {string} sourceHandle - The source handle of the connection.
 * @param {string} targetHandle - The target handle of the connection.
 * @returns {boolean} - True if the connection is a transport connection, false otherwise.
 */
const isTransportConnection = (sourceHandle, targetHandle) => {
  const sourcePrefix = 'outbox'
  const targetPrefix = 'inbox'

  // Check if the source and target handles have the correct prefixes in both directions
  if (
    (sourceHandle.startsWith(sourcePrefix) &&
      targetHandle.startsWith(targetPrefix)) ||
    (sourceHandle.startsWith(targetPrefix) &&
      targetHandle.startsWith(sourcePrefix))
  ) {
    // Allow connections between any outbox# and any inbox#, and vice versa
    return true
  }

  // If the handles don't have the correct prefixes in either direction, the type is not transport
  return false
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

  if (isTransportConnection(connection.sourceHandle, connection.targetHandle)) {
    connection.type = 'transport'
    connection.animated = true
  }
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

  // Get the source and target nodes
  const { sourceNode, targetNode } = getNodes(connection, lookup)

  // Set edge type to 'signal' if either handle is a SignalHandle
  if (
    connection.sourceHandle.includes('-') ||
    connection.targetHandle.includes('-')
  ) {
    connection.type = 'signal'
  } else {
    connection.type = 'default'
  }

  // Log a warning if either the source or target node is not found
  warnIfNodesNotFound(sourceNode, targetNode)

  if (sourceNode && targetNode) {
    const sourceType = sourceNode?.type
    const targetType = targetNode?.type

    setConnectionTypeAndAnimation(connection, sourceType, targetType)
  }

  setEdges(edges => addEdge(connection, edges))
}

const lookupSelector = state => state.lookup
const generateIdSelector = state => state.generateId

/**
 * Custom hook that returns a memoized version of the onConnect function.
 * @param {Object} storeApi - The store API object.
 * @param {Function} setEdges - The function to update the edges state.
 * @returns {Function} - The memoized onConnect function.
 */
const useOnConnect = setEdges => {
  // Get lookup and generateId functions from the store
  const lookup = useStore(lookupSelector)
  const generateId = useStore(generateIdSelector)

  return useCallback(
    connection => onConnect({ connection, lookup, generateId, setEdges }),
    [lookup, generateId, setEdges]
  )
}

export default useOnConnect
