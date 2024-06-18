import getTransportBeltStore from '../transportBelt'
import getFirstOutboxEdgeBucket from './getFirstOutboxEdgeBucket'
import getLastInboxEdgeBucketItemId from './getLastInboxEdgeBucketItemId'
import getNextInboxEdge from './getNextInboxEdge'
import getNextOutboxEdge from './getNextOutboxEdge'
import moveItem from './moveItem'

/**
 * Function to handle the tick event.
 * @param {Object} params - An object containing the necessary parameters.
 * @param {Function} params.set - A function to set the state.
 * @param {Function} params.get - A function to get the state.
 * @param {number} params.tickCounter - The current tick counter.
 */
const handleTick = ({ set, get, tickCounter }) => {
  const {
    inboxEdgeIds,
    outboxEdgeIds,
    tickModulo,
    lastInboxIndex,
    lastOutboxIndex,
    setLastInboxIndex,
    setLastOutboxIndex,
  } = get()

  // Early return if conditions are not met
  if (
    tickCounter % tickModulo !== 0 ||
    inboxEdgeIds.length === 0 ||
    outboxEdgeIds.length === 0
  )
    return

  // Get the next inbox edge id
  const inboxEdgeId = getNextInboxEdge({
    inboxEdgeIds,
    lastInboxIndex,
    setLastInboxIndex,
  })

  // Get the inbox edge state
  const inboxEdgeState = getTransportBeltStore(inboxEdgeId).getState()

  // Get the last inbox edge bucket item id
  const lastInboxEdgeBucketItemId = getLastInboxEdgeBucketItemId(inboxEdgeState)

  // Early return if there is no item in the last inbox edge bucket
  if (lastInboxEdgeBucketItemId === null) return

  // Get the next outbox edge id
  const outboxEdgeId = getNextOutboxEdge({
    outboxEdgeIds,
    lastOutboxIndex,
    setLastOutboxIndex,
  })

  // Get the outbox edge state
  const outboxEdgeState = getTransportBeltStore(outboxEdgeId).getState()

  // Get the first outbox edge bucket
  const firstOutboxEdgeBucket = getFirstOutboxEdgeBucket(outboxEdgeState)

  // Early return if the first outbox edge bucket is not empty
  if (firstOutboxEdgeBucket.itemId !== null) return

  // Move the item from the inbox to the outbox
  moveItem({ inboxEdgeState, outboxEdgeState, lastInboxEdgeBucketItemId })
}

export default handleTick
