import { useCallback } from 'react'

/**
 * Checks if a connection is valid based on certain conditions.
 * @param {object} connection - The connection object to be checked.
 * @param {object} storeApi - The store API object.
 * @returns {boolean} - Returns true if the connection is valid, false otherwise.
 */
const isValidConnection = (connection, storeApi) => {
  // Sanity check
  if (!connection) return false
  if (!connection.source || !connection.target) return false
  if (!storeApi) return false

  // Ignore connections to self
  if (connection.source === connection.target) return false

  // Outbox is only allowed to connect to inbox
  if (
    connection.sourceHandle === 'outbox' &&
    connection.targetHandle !== 'inbox'
  )
    return false

  // Inbox is only allowed to connect to outbox
  if (
    connection.sourceHandle === 'inbox' &&
    connection.targetHandle !== 'outbox'
  )
    return false

  // Get the current store state
  const store = storeApi.getState()

  // Get the lookup function
  const { lookup } = store

  // Get the types of the source and target nodes
  const sourceNode = lookup(connection.source)
  const targetNode = lookup(connection.target)

  // Get types of the source and target nodes
  const sourceType = sourceNode?.type
  const targetType = targetNode?.type

  console.log({ sourceType, targetType, connection })

  // Block all connections between input portals to prevent confusion
  if (sourceType === 'inputPortal' && targetType === 'inputPortal') return false

  // Block all connections between output portals to prevent confusion
  if (sourceType === 'outputPortal' && targetType === 'outputPortal')
    return false

  // Prevent portal's output from connecting to another portal's input
  if (
    sourceType === 'outputPortal' &&
    targetType === 'inputPortal' &&
    (connection.sourceHandle === 'outbox' ||
      connection.targetHandle === 'inbox')
  )
    return false

  // allow all other connections
  return true
}

/**
 * Custom hook for checking if a connection is valid.
 * @param {Object} storeApi - The store API.
 * @returns {Function} The isValidConnection function.
 */
const useIsValidConnection = storeApi => {
  // Return the isValidConnection function
  return useCallback(
    connection => isValidConnection(connection, storeApi),
    [storeApi]
  )
}

export default useIsValidConnection
