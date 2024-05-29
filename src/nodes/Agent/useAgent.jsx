import { useCallback, useState, useEffect } from 'react'
import { useStore } from '@xyflow/react'
import signalTypes from '../../constants/signalTypes'

const useAgent = ({ id, data }) => {
  const store = useStore()

  const signalHubEmit = useStore(s => s.signalHubEmit)
  const signalHubSubscribe = useStore(s => s.signalHubSubscribe)
  const signalHubUnsubscribe = useStore(s => s.signalHubSubscribe)

  // Subscribe to own ratings when created
  useEffect(() => {
    // Sanity check
    if (!signalHubSubscribe || !signalHubUnsubscribe) return

    const handleRatingSignal = (...props) => {
      // Update internal rating state
      console.log(props)
    }

    // Add subscription
    const ratingChannel = `rating-${id}`
    signalHubSubscribe(ratingChannel, handleRatingSignal)

    return () => {
      // Unsubscribe on cleanup
      signalHubUnsubscribe(ratingChannel, handleRatingSignal)
    }
  }, [id, signalHubSubscribe, signalHubUnsubscribe])

  // Agent data and settings
  const batchSize = parseInt(data?.batchSize, 10) || 1

  // Auto-run feature state
  const [autoRun, setAutoRun] = useState(false)

  // Store references
  const socket = store.socket
  const setItem = store.setItem
  const items = store.getLocationItems(id)
  const setItemLocation = store.setItemLocation
  const outboxEdgeId = store
    .getNodeEdges(id)
    .find(edge => edge.source === id && edge.sourceHandle === 'outbox')?.id

  // Toggle auto-run
  const toggleAutoRun = useCallback(() => {
    setAutoRun(prev => !prev)
  }, [])

  // Emit a signal when automation state changes
  useEffect(() => {
    // Sanity check
    if (!signalHubEmit) return

    // Emit the change
    signalHubEmit(id, signalTypes.AUTOMATION_CHANGE, { autoRun })
  }, [id, signalHubEmit, autoRun])

  // Trigger the backend LLM call
  const triggerLLMCall = useCallback(async () => {
    // Check if enough items are available
    if (items.length < batchSize) {
      console.warn(
        `Not enough items for LLM call. Need ${batchSize}, have ${items.length}.`
      )
      return
    }

    // Prepare user prompt from copied items
    const userPrompt = JSON.parse(JSON.stringify(items)).slice(0, batchSize)
    userPrompt.forEach((userPromptItem, index) => {
      // Cleanup
      delete userPromptItem.id
      delete userPromptItem.emoji
      delete userPromptItem.location

      // Move the used items to the outbox
      setItemLocation({ itemId: items[index].id, locationId: outboxEdgeId })
    })

    // Emit LLM call to the backend
    socket.emit(
      'llmSchema',
      { preset: 'markdown', content: userPrompt },
      response => {
        try {
          console.log('LLM Response:', response)

          // Create a new item from the response
          const newItem = {
            type: data.outputType || 'llmResponse',
            emoji: data.outputEmoji || '💬',
            markdown: response,
            location: {
              id: outboxEdgeId,
              distance: 0,
            },
          }

          // Add the new item to the store
          setItem(newItem)
        } catch (error) {
          console.error('Error processing LLM response:', error)
        }
      }
    )
  }, [items, setItemLocation, outboxEdgeId, data, socket, setItem, batchSize])

  // Auto-run logic
  useEffect(() => {
    if (autoRun && items.length >= batchSize) {
      triggerLLMCall()
    }
  }, [autoRun, items, batchSize, triggerLLMCall])

  return { triggerLLMCall, items, autoRun, toggleAutoRun }
}

export default useAgent
