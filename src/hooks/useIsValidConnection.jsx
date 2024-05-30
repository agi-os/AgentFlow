import { useStore } from '@xyflow/react'
import { useCallback } from 'react'

/**
 * Defines the allowed connections between different types of portals.
 * @type {Object.<string, string[]>}
 */
const ALLOWED_CONNECTIONS = {
  outbox: ['inbox'],
  outbox2: ['inbox'],
  inbox: ['outbox', 'outbox2'],
  inputPortal: ['outputPortal'],
  outputPortal: ['inputPortal'],
}

/**
 * Checks if a connection is valid based on certain conditions.
 * @param {object} connection - The connection object to be checked.
 * @param {object} storeApi - The store API object.
 * @returns {boolean} - Returns true if the connection is valid, false otherwise.
 */
const isValidConnection = (connection, lookup) => {
  // Sanity check
  if (!connection || !connection.source || !connection.target || !lookup)
    return false

  // Extract the values from the connection object
  const { source, type, sourceHandle, target, targetHandle } = connection

  // If there are no source or target handles, allow the connection
  if (!sourceHandle || !targetHandle) return true

  // Block all loopback connections
  if (source === target) return false

  // Allow signal connections unconditionally
  if (type === 'signal') return true

  // When sourceHandle and targetHandle both contain '-' allow the signal
  if (sourceHandle.includes('-') && targetHandle.includes('-')) return true

  // Get the types of the source and target nodes
  const sourceNode = lookup(source)
  const targetNode = lookup(target)

  // Get types of the source and target nodes
  const sourceType = sourceNode?.type
  const targetType = targetNode?.type

  // Check if the connection is allowed
  const allowedConnections = ALLOWED_CONNECTIONS[sourceType] || []
  if (allowedConnections.includes(targetType)) return true

  // Check if the handle connection is allowed
  const allowedHandleConnections = ALLOWED_CONNECTIONS[sourceHandle] || []
  if (allowedHandleConnections.includes(targetHandle)) return true

  // Disallow all other connections
  return false
}
/**
 * Custom hook for checking if a connection is valid.
 * @param {Object} storeApi - The store API.
 * @returns {Function} The isValidConnection function.
 */
const useIsValidConnection = () => {
  // Get a handle to lookup function in the store
  const lookup = useStore(s => s.lookup)

  // Return the isValidConnection function
  return useCallback(
    connection => isValidConnection(connection, lookup),
    [lookup]
  )
}

export default useIsValidConnection
