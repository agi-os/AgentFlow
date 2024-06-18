import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import handleTick from './handleTick'

/**
 * Represents the state of a splitter.
 * @typedef {Object} SplitterState
 * @property {string} id - The unique identifier for the splitter.
 */

/**
 * @typedef {import('zustand').StoreApi<SplitterState>} ZustandStore
 */

/**
 * Creates a Zustand store for managing the state of a splitter.
 *
 * @param {string} id - The unique identifier for the splitter.
 * @returns {ZustandStore<SplitterState>} - A Zustand store for managing the splitter state.
 */
const createSplitterStore = id =>
  create(
    immer((set, get) => ({
      id,
      inboxEdgeIds: [],
      outboxEdgeIds: [],

      // Number of ticks to move a single item from inbox to outbox
      tickModulo: 60,

      // Last inbox edge index used to receive an item
      lastInboxIndex: 0,

      // Last outbox edge index used to release an item
      lastOutboxIndex: 0,

      // Tick event callback
      tick: tickCounter => handleTick({ set, get, tickCounter }),

      // Update list of inbox edges
      setInboxEdgeIds: inboxEdgeIds =>
        set(state => {
          state.inboxEdgeIds = inboxEdgeIds
        }),

      // Update list of outbox edges
      setOutboxEdgeIds: outboxEdgeIds =>
        set(state => {
          state.outboxEdgeIds = outboxEdgeIds
        }),

      // Update tick modulo
      setTickModulo: tickModulo =>
        set(state => {
          state.tickModulo = tickModulo
        }),

      // Update last inbox edge index used to receive an item
      setLastInboxIndex: lastInboxIndex =>
        set(state => {
          state.lastInboxIndex = lastInboxIndex
        }),

      // Update last outbox edge index used to release an item
      setLastOutboxIndex: lastOutboxIndex =>
        set(state => {
          state.lastOutboxIndex = lastOutboxIndex
        }),
    }))
  )

export default createSplitterStore
