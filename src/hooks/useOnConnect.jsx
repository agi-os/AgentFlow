import { useCallback } from 'react'
import { addEdge } from '@xyflow/react'

export const onConnect = ({ connection, storeApi, setEdges }) => {
  // Get the current store state
  const store = storeApi.getState()

  // Get the lookup function
  const { lookup, generateId } = store

  // Set the id to uniquely identify this connection
  connection.id = generateId()

  // Default edge is an animated belt
  connection.type = 'animated'
  connection.animated = true

  // Get the types of the source and target nodes
  const sourceNode = lookup(connection.source)
  const targetNode = lookup(connection.target)

  // Sanity check
  if (sourceNode && targetNode) {
    console.log({ sourceNode, targetNode })

    // Get types of the source and target nodes
    const sourceType = sourceNode?.type
    const targetType = targetNode?.type

    // If one of the nodes is a inputPortal and the other is an outputPortal, set the type to 'default'
    if (
      (sourceType === 'inputPortal' && targetType === 'outputPortal') ||
      (sourceType === 'outputPortal' && targetType === 'inputPortal')
    ) {
      connection.type = 'default'

      // Reverse the connection if the source is an outputPortal
      if (sourceType === 'outputPortal') {
        connection = {
          ...connection,
          source: connection.target,
          sourceHandle: connection.targetHandle,
          target: connection.source,
          targetHandle: connection.sourceHandle,
        }
      }
    }
  } else {
    console.warn('source or target node not found', {
      sourceNode,
      targetNode,
    })
  }

  console.log('onConnect', connection)

  setEdges(edges => addEdge(connection, edges))
}

const useOnConnect = (storeApi, setEdges) => {
  return useCallback(
    connection => onConnect({ connection, storeApi, setEdges }),
    [storeApi, setEdges]
  )
}

export default useOnConnect
