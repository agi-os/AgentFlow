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
   * Schema for ITEM_RATED signal.
   * Emitted when sending feedback on item quality.
   */
  ITEM_RATED: {
    toString: () => 'ITEM_RATED',
    type: 'object',
    properties: {
      rating: { type: 'integer', min: 1, max: 10 },
      feedback: { type: 'string' },
    },
    required: ['rating', 'feedback'],
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

  /**
   * DataChange Event
   * Emitted when the value of a Variable (configuration or data) changes.
   */
  DATA_CHANGE: {
    toString: () => 'DATA_CHANGE',
    type: 'object',
    properties: {
      nodeId: {
        type: 'string',
        description: 'OPC UA NodeId of the changed variable',
      },
      value: { type: 'any', description: 'New value of the variable' },
    },
    required: ['nodeId', 'value'],
  },

  /**
   * AlarmConditionType Event
   * Emitted by an agent to signal an anomaly or potential issue.
   */
  ALARM: {
    toString: () => 'ALARM',
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Description of the alarm condition',
      },
      severity: {
        type: 'integer',
        description: 'Severity level (1-100, higher is more severe)',
      },
      sourceNodeId: {
        type: 'string',
        description: 'NodeId of the agent that emitted the alarm',
      },
    },
    required: ['message', 'severity', 'sourceNodeId'],
  },

  /**
   * LimitAlarmType Event
   * Emitted when a limit or threshold is exceeded.
   */
  LIMIT_EXCEEDED: {
    toString: () => 'LIMIT_EXCEEDED',
    type: 'object',
    properties: {
      limitType: {
        type: 'string',
        description: 'Type of limit exceeded (e.g., tool usage, queue length)',
      },
      threshold: {
        type: 'number',
        description: 'The threshold that was exceeded',
      },
      currentValue: {
        type: 'number',
        description: 'The current value that triggered the alarm',
      },
    },
    required: ['limitType', 'threshold', 'currentValue'],
  },

  /**
   * SystemEventType Event
   * For general system-level events.
   */
  SYSTEM_EVENT: {
    toString: () => 'SYSTEM_EVENT',
    type: 'object',
    properties: {
      eventType: {
        type: 'string',
        description: 'Type of system event (e.g., NODE_STARTUP, NODE_SHUTDOWN)',
      },
      message: {
        type: 'string',
        description: 'Optional message providing more details',
      },
    },
    required: ['eventType'],
  },

  /**
   * AuditEventType Event
   * Tracks security and configuration changes.
   */
  AUDIT_EVENT: {
    toString: () => 'AUDIT_EVENT',
    type: 'object',
    properties: {
      eventType: {
        type: 'string',
        description: 'Type of audit event (e.g., CONFIG_CHANGE, LOGIN)',
      },
      user: {
        type: 'string',
        description: 'User or client associated with the event',
      },
      targetNodeId: {
        type: 'string',
        description: 'NodeId of the target of the event',
      },
    },
    required: ['eventType', 'user', 'targetNodeId'],
  },

  /**
   * Configuration change notification
   * Subscribed node can update own configuration from the item id provided.
   */
  CONFIGURATION_UPDATED: {
    toString: () => 'CONFIGURATION_UPDATED',
    type: 'object',
    properties: {
      itemId: {
        type: 'string',
        description: 'ID of the item containing the configuration',
      },
    },
    required: ['itemId'],
  },
}
