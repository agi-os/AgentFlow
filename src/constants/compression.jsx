/**
 * Map of values to use when (de)compressing blueprints in copy-paste operations
 */
export const compressionMap = {
  entry: 'e',
  agent: 'a',
  toolChest: 't',
  outbox: 'o',
  inbox: 'i',
  queue: 'q',
  default: 0,
  'topLeft-top': 1,
  'topLeft-left': 2,
  'topRight-top': 3,
  'topRight-right': 4,
  'bottomLeft-bottom': 5,
  'bottomLeft-left': 6,
  'bottomRight-bottom': 7,
  'bottomRight-right': 8,
}
