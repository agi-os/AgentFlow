/**
 * @file signalTypes.jsx
 * @description Defines the signal types used for communication between nodes and ICs in the LLM OS.
 * This file serves as both documentation for developers and a source of truth for signal type validation within the system.
 */

/**
 * Valid signal types.
 * @type {Object}
 */
export default {
  /**
   * Schema for ITEM_ARRIVED signal.
   * Emitted when a data packet arrives at a node.
   */
  ITEM_ARRIVED: {
    toString: () => 'ITEM_ARRIVED',
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },

  /**
   * Schema for ITEM_SENT signal.
   * Emitted when a data packet is sent from a node.
   */
  ITEM_SENT: {
    toString: () => 'ITEM_SENT',
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },

  /**
   * Schema for SEMAPHORE_CHANGE signal.
   * Emitted when the color of a semaphore changes.
   */
  SEMAPHORE_CHANGE: {
    toString: () => 'SEMAPHORE_CHANGE',
    type: 'object',
    properties: {
      color: { type: 'string' },
    },
    required: ['color'],
  },

  /**
   * Schema for AUTOMATION_CHANGE signal.
   * Emitted when the mode of automation changes.
   */
  AUTOMATION_CHANGE: {
    toString: () => 'AUTOMATION_CHANGE',
    type: 'object',
    properties: {
      autoRun: { type: 'boolean' },
    },
    required: ['autoRun'],
  },

  /**
   * Schema for TASK_REQUEST signal.
   * Emitted to request an agent or node/IC to perform a task.
   */
  TASK_REQUEST: {
    toString: () => 'TASK_REQUEST',
    type: 'object',
    properties: {
      taskId: { type: 'string' },
      taskDescription: { type: 'string' },
      requiredTools: {
        type: 'array',
        items: { type: 'string' },
      },
      inputData: {
        type: ['object', 'array'],
        items: { type: 'object' },
      },
    },
    required: ['taskId', 'taskDescription', 'requiredTools'],
  },

  /**
   * Schema for TASK_ACCEPTED signal.
   * Emitted to confirm that a task request has been accepted.
   */
  TASK_ACCEPTED: {
    toString: () => 'TASK_ACCEPTED',
    type: 'object',
    properties: {
      taskId: { type: 'string' },
      agentId: { type: 'string' },
    },
    required: ['taskId', 'agentId'],
  },

  /**
   * Schema for TASK_STATUS_UPDATE signal.
   * Emitted to provide updates on the progress of a task.
   */
  TASK_STATUS_UPDATE: {
    toString: () => 'TASK_STATUS_UPDATE',
    type: 'object',
    properties: {
      taskId: { type: 'string' },
      status: { type: 'string' },
      progress: { type: 'number' },
      intermediateData: { type: 'object' },
    },
    required: ['taskId', 'status'],
  },

  /**
   * Schema for TASK_RESULT signal.
   * Emitted to deliver the results of a completed task.
   */
  TASK_RESULT: {
    toString: () => 'TASK_RESULT',
    type: 'object',
    properties: {
      taskId: { type: 'string' },
      resultData: {
        type: ['object', 'array'],
        items: { type: 'object' },
      },
      status: { type: 'string' },
    },
    required: ['taskId', 'resultData', 'status'],
  },
}
