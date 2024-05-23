/**
 * @file signalTypes.jsx
 * @description Defines the signal types used for communication between nodes and ICs in the LLM OS.
 * This file serves as both documentation for developers and a source of truth for signal type validation within the system.
 */

/**
 * Valid signal types.
 * @type {Object}
 */
export const signalTypes = {
  /**
   * Emitted when a data packet arrives at a node.
   * @property {string} id - Id of the received data packet.
   */
  ITEM_ARRIVED: 'ITEM_ARRIVED',

  /**
   * Emitted when a data packet is sent from a node.
   * @property {string} id - Id of the data packet being sent.
   */
  ITEM_SENT: 'ITEM_SENT',

  /**
   * Emitted when the color of a semaphore changes.
   * @property {string} color - The new color of the semaphore.
   */
  SEMAPHORE_CHANGE: 'SEMAPHORE_CHANGE',

  /**
   * Emitted to request an agent or node/IC to perform a task.
   * @property {string} taskId - Unique identifier for the task.
   * @property {string} taskDescription - Description of the task.
   * @property {string[]} requiredTools - Array of tool names needed.
   * @property {object|object[]} [inputData] - Optional input data packet(s).
   */
  TASK_REQUEST: 'TASK_REQUEST',

  /**
   * Emitted to confirm that a task request has been accepted.
   * @property {string} taskId - The Id of the accepted task.
   * @property {string} agentId - The Id of the agent/node/IC accepting the task.
   */
  TASK_ACCEPTED: 'TASK_ACCEPTED',

  /**
   * Emitted to provide updates on the progress of a task.
   * @property {string} taskId - The Id of the task being updated.
   * @property {string} status - The current status (e.g., "in progress", "completed", "failed").
   * @property {number} [progress] - Optional progress indicator (e.g., percentage).
   * @property {object} [intermediateData] - Optional intermediate data generated.
   */
  TASK_STATUS_UPDATE: 'TASK_STATUS_UPDATE',

  /**
   * Emitted to deliver the results of a completed task.
   * @property {string} taskId - The Id of the completed task.
   * @property {object|object[]} resultData - The data packet(s) representing the output.
   * @property {string} status -  "success" or "failure"
   */
  TASK_RESULT: 'TASK_RESULT',
}
