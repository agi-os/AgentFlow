import Ajv from 'ajv'

const ajv = new Ajv()

export const dataPacketSchema = {
  type: 'object',
  properties: {
    type: { type: 'string', description: 'Type of the item' },
    emoji: { type: 'string', description: 'Emoji representing the item' },
    data: { type: 'object', description: 'Arbitrary data payload' },
    metadata: {
      type: 'object',
      description: 'Metadata about the item (timestamps, source, etc.)',
      properties: {
        createdAt: { type: 'number', description: 'Timestamp of creation' },
        sourceNodeId: {
          type: 'string',
          description: 'ID of the node that created the item',
        },
      },
    },
  },
  required: ['type'],
}

const validate = ajv.compile(dataPacketSchema)

/**
 * Validates a data packet against a predefined schema.
 *
 * @param {Object} packet - The data packet to validate.
 * @returns {boolean} - True if the packet is valid, false otherwise.
 */
export const validateDataPacket = packet => {
  const valid = validate(packet)
  if (!valid) {
    console.log('Validation errors:', validate.errors)
    return false
  }
  return true
}
