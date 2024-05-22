import { useCallback, useMemo } from 'react'
import { useNodeId, useStore } from '@xyflow/react'

const useAgent = () => {
  const id = useNodeId()

  // Store references
  const socket = useStore(s => s.socket)
  const setItem = useStore(s => s.setItem)
  const items = useStore(s => s.getLocationItemsSorted(id))

  const outboxEdgeId = useStore(
    s =>
      s
        .getNodeEdges(id)
        .find(edge => edge.source === id && edge.sourceHandle === 'outbox')?.id
  )

  // Trigger the backend call
  const triggerLLMCall = useCallback(async () => {
    if (items.length < 2) {
      console.warn(
        'Agent needs at least system instructions and one context item.'
      )
      return
    }

    const systemInstructions = items[0]
    const contextItems = items.slice(1)

    const dataToSend = {
      systemInstructions: systemInstructions.data,
      context: contextItems.map(item => item.data),
    }

    socket.emit('test', dataToSend, response => {
      console.log('LLM Response:', response)

      // If there's no outbox edge, do nothing
      if (!outboxEdgeId) return

      // 2. Create the new item object
      const newItem = {
        type: 'llmResponse', // Set the type from the response or a default
        emoji: '💬', // Set an appropriate emoji
        data: response,
        location: {
          id: outboxEdgeId,
          distance: 0,
        },
      }
      console.log({ newItem })
      // 3. Add the new item to the store
      setItem(newItem)
    })
  }, [items, socket, outboxEdgeId, setItem])

  return { triggerLLMCall, items }
}

export default useAgent
