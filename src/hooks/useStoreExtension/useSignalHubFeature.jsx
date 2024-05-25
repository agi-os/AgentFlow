import { useEffect } from 'react'
import { useStore, useStoreApi } from '@xyflow/react'
import signalTypes from '../../constants/signalTypes'

/**
 * Custom React hook to initialize and manage a signal hub in the store.
 * The signal hub allows components to subscribe to and emit signals,
 * and now visually represents subscriptions using signalEdges.
 *
 * @returns {void}
 */
const useSignalHubFeature = () => {
  const { getState, setState } = useStoreApi()

  // Fetch relevant parts of the store using useStore hook
  const signalEdgeLookup = useStore(s => s.signalEdgeLookup)
  const nodeSignalSubscriptionLookup = useStore(
    s => s.nodeSignalSubscriptionLookup
  )
  const signalHubSubscribe = useStore(s => s.signalHubSubscribe)
  const signalHubUnsubscribe = useStore(s => s.signalHubUnsubscribe)
  const signalHubEmit = useStore(s => s.signalHubEmit)
  const addNodeSignalSubscription = useStore(s => s.addNodeSignalSubscription)
  const removeNodeSignalSubscription = useStore(
    s => s.removeNodeSignalSubscription
  )

  // Initialize the signalEdgeLookup
  useEffect(() => {
    // Abort if already defined
    if (signalEdgeLookup) return

    setState(draft => ({
      ...draft,
      signalEdgeLookup: new Map(),
    }))
  }, [setState, signalEdgeLookup])

  // Initialize the nodeSignalSubscriptionLookup
  useEffect(() => {
    // Abort if already defined
    if (nodeSignalSubscriptionLookup) return

    setState(draft => ({
      ...draft,
      nodeSignalSubscriptionLookup: new Map(),
    }))
  }, [setState, nodeSignalSubscriptionLookup])

  useEffect(() => {
    // Abort if already defined
    if (addNodeSignalSubscription) return

    // Abort if requirements are not available
    if (!nodeSignalSubscriptionLookup) return

    setState(draft => ({
      ...draft,
      addNodeSignalSubscription: (nodeId, edgeId) => {
        if (!nodeSignalSubscriptionLookup.has(nodeId)) {
          nodeSignalSubscriptionLookup.set(nodeId, new Set())
        }
        nodeSignalSubscriptionLookup.get(nodeId).add(edgeId)
      },
    }))
  }, [setState, addNodeSignalSubscription, nodeSignalSubscriptionLookup])

  useEffect(() => {
    // Abort if already defined
    if (removeNodeSignalSubscription) return

    // Abort if requirements are not available
    if (!nodeSignalSubscriptionLookup) return

    setState(draft => ({
      ...draft,
      removeNodeSignalSubscription: (nodeId, edgeId) => {
        if (nodeSignalSubscriptionLookup.has(nodeId)) {
          nodeSignalSubscriptionLookup.get(nodeId).delete(edgeId)
        }
      },
    }))
  }, [setState, removeNodeSignalSubscription, nodeSignalSubscriptionLookup])

  // Define signalHubSubscribe
  useEffect(() => {
    // Abort if already defined
    if (signalHubSubscribe) return

    // Abort if requirements are not available
    if (!addNodeSignalSubscription || !signalEdgeLookup) return

    setState(draft => ({
      ...draft,
      signalHubSubscribe: (
        sourceNodeId,
        signalType,
        callback,
        targetNodeId = null
      ) => {
        const edgeId = draft.generateId()

        signalEdgeLookup.set(edgeId, {
          sourceNodeId,
          targetNodeId, // Can be null for broadcasts
          signalType,
          callback, // Store the callback for unsubscription
        })

        addNodeSignalSubscription(sourceNodeId, edgeId)
        if (targetNodeId) {
          addNodeSignalSubscription(targetNodeId, edgeId)
        }

        // Trigger edge updates only when necessary
        setTimeout(() => getState().updateNodeEdgeLookup(), 0)
      },
    }))
  }, [
    addNodeSignalSubscription,
    setState,
    signalEdgeLookup,
    signalHubSubscribe,
    getState,
  ])

  // Define signalHubUnsubscribe
  useEffect(() => {
    // Abort if already defined
    if (signalHubUnsubscribe) return

    // Abort if requirements are not available
    if (!removeNodeSignalSubscription || !signalEdgeLookup) return

    // Helper function to find the edgeId based on subscription details
    const findEdgeId = (nodeId, signalType, callback) => {
      const edgeIds = nodeSignalSubscriptionLookup.get(nodeId) || []
      for (const edgeId of edgeIds) {
        const edgeData = signalEdgeLookup.get(edgeId)
        if (
          edgeData.signalType === signalType &&
          edgeData.callback === callback
        ) {
          return edgeId
        }
      }
      return null
    }

    setState(draft => ({
      ...draft,
      signalHubUnsubscribe: (nodeId, signalType, callback) => {
        const edgeId = findEdgeId(nodeId, signalType, callback, draft)
        if (edgeId) {
          const edgeData = signalEdgeLookup.get(edgeId)
          signalEdgeLookup.delete(edgeId)
          removeNodeSignalSubscription(nodeId, edgeId)
          if (edgeData.targetNodeId) {
            removeNodeSignalSubscription(edgeData.targetNodeId, edgeId)
          }

          // Trigger edge updates only when necessary
          setTimeout(() => getState().updateNodeEdgeLookup(), 0)
        }
      },
    }))
  }, [
    setState,
    signalHubUnsubscribe,
    removeNodeSignalSubscription,
    signalEdgeLookup,
    nodeSignalSubscriptionLookup,
    getState,
  ])

  // Define signalHubEmit
  useEffect(() => {
    // Abort if already defined
    if (signalHubEmit) return

    // Abort if requirements are not available
    if (!nodeSignalSubscriptionLookup || !signalEdgeLookup) return

    const processEdgeId = ({ edgeId, payload, signalType, sourceNodeId }) => {
      const { targetNodeId, callback } = signalEdgeLookup.get(edgeId)

      // If the targetNodeId is null (broadcast) or matches the payload's target, invoke the callback
      if (targetNodeId === null || targetNodeId === payload.targetNodeId) {
        callback(payload, signalType.toString(), sourceNodeId)
      }
    }

    setState(draft => ({
      ...draft,
      signalHubEmit: (sourceNodeId, signalType, payload) => {
        if (!(signalType in signalTypes)) {
          console.error('Invalid signal type:', signalType)
          return
        }

        // Get a list of edge ids
        const edgeIds = nodeSignalSubscriptionLookup.get(sourceNodeId) || []

        // Process all edge ids
        edgeIds.forEach(edgeId =>
          processEdgeId({ edgeId, payload, signalType, sourceNodeId })
        )
      },
    }))
  }, [nodeSignalSubscriptionLookup, setState, signalEdgeLookup, signalHubEmit])
}

export default useSignalHubFeature
