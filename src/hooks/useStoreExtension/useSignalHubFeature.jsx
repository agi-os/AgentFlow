import { useEffect } from 'react'
import { useStore, useStoreApi } from '@xyflow/react'
import { signalTypes } from '../../constants/signalTypes'

/**
 * Custom React hook to initialize and manage a signal hub in the store.
 * The signal hub allows components to subscribe to and emit signals.
 * @returns {void}
 */
const useSignalHubFeature = () => {
  const { setState } = useStoreApi()

  // Fetch relevant parts of the store using useStore hook
  const signalHubSubscribers = useStore(s => s.signalHubSubscribers)
  const signalHubSubscribe = useStore(s => s.signalHubSubscribe)
  const signalHubUnsubscribe = useStore(s => s.signalHubUnsubscribe)
  const signalHubEmit = useStore(s => s.signalHubEmit)

  // Initialize the signalHubSubscribers map if it's not already initialized
  useEffect(() => {
    // If signalHubSubscribers is already defined, abort
    if (signalHubSubscribers) return

    // Initialize an empty Map to keep track of subscribers
    setState(draft => ({
      ...draft,
      signalHubSubscribers: new Map(),
    }))
  }, [setState, signalHubSubscribers])

  // Define a method to subscribe to a node with a callback
  useEffect(() => {
    // If signalHubSubscribe is already defined or signalHubSubscribers is not a Map, abort
    if (signalHubSubscribe || !(signalHubSubscribers instanceof Map)) return

    // Define a method to subscribe to a node with a callback
    setState(draft => ({
      ...draft,
      signalHubSubscribe: (nodeId, callback) => {
        if (!signalHubSubscribers.has(nodeId)) {
          signalHubSubscribers.set(nodeId, [])
        }
        signalHubSubscribers.get(nodeId).push(callback)
      },
    }))
  }, [setState, signalHubSubscribe, signalHubSubscribers])

  // Define a method to unsubscribe a callback from a node
  useEffect(() => {
    // If signalHubUnsubscribe is already defined or signalHubSubscribers is not a Map, abort
    if (signalHubUnsubscribe || !(signalHubSubscribers instanceof Map)) return

    setState(draft => ({
      ...draft,
      signalHubUnsubscribe: (nodeId, callback) => {
        if (signalHubSubscribers.has(nodeId)) {
          const callbacks = signalHubSubscribers.get(nodeId)
          const index = callbacks.indexOf(callback)
          if (index > -1) {
            callbacks.splice(index, 1)
          }
        }
      },
    }))
  }, [setState, signalHubUnsubscribe, signalHubSubscribers])

  // Define a method to emit a signal to all subscribers of a node
  useEffect(() => {
    // If signalHubEmit is already defined or signalHubSubscribers is not a Map, abort
    if (signalHubEmit || !(signalHubSubscribers instanceof Map)) return

    setState(draft => ({
      ...draft,
      signalHubEmit: (sourceNodeId, signalType, payload) => {
        if (!(signalType in signalTypes)) {
          console.error('Invalid signal type:', signalType)
          return
        }

        const subscribers = signalHubSubscribers.get(sourceNodeId) || []

        subscribers.forEach(callback => {
          callback(signalType, payload)
        })
      },
    }))
  }, [setState, signalHubEmit, signalHubSubscribers])
}

export default useSignalHubFeature
