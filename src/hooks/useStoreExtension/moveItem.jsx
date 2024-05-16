/**
 * Move an item from one entity to another.
 * @param {Object} props - The move item parameters.
 * @param {Object} props.store - The store object.
 * @param {string} props.itemId - The ID of the item to move.
 * @param {string} props.fromId - The ID of the entity to move the item from.
 * @param {string} props.toId - The ID of the entity to move the item to.
 * @param {string} props.fromType - The type of the entity to move the item from.
 * @param {string} props.toType - The type of the entity to move the item to.
 * @returns {boolean} True if the item was moved successfully, false otherwise.
 */
const moveItem = ({ store, itemId, fromId, toId, fromType, toType }) => {
  console.log({ itemId, fromId, toId, fromType, toType })

  const state = store.getState()
  const {
    getItem,
    [`${fromType}Lookup`]: fromLookup,
    [`${toType}Lookup`]: toLookup,
  } = state

  // Validate the item existence and entity presence
  if (!getItem(itemId)) return false
  const fromEntity = fromLookup.get(fromId)
  const toEntity = toLookup.get(toId)
  if (!fromEntity || !toEntity) return false

  const fromItems = fromEntity?.data?.items || []
  const toItems = toEntity?.data?.items || []

  // Validate item presence in fromEntity and absence in toEntity
  if (!fromItems.includes(itemId) || toItems.includes(itemId)) return false

  // Create shallow copies of the entities and their items arrays
  const updatedFromEntity = {
    ...fromEntity,
    data: { ...fromEntity.data, items: fromItems.filter(i => i !== itemId) },
  }
  const updatedToEntity = {
    ...toEntity,
    data: { ...toEntity.data, items: [...toItems, itemId] },
  }

  // Create shallow copy of the lookup maps and update the relevant entries
  const updatedFromLookup = new Map(fromLookup)
  updatedFromLookup.set(fromId, updatedFromEntity)

  const updatedToLookup = new Map(toLookup)
  updatedToLookup.set(toId, updatedToEntity)

  // Create a shallow copy of the state with the updated lookup maps
  const newState = {
    ...state,
    [`${fromType}Lookup`]: updatedFromLookup,
    [`${toType}Lookup`]: updatedToLookup,
  }

  // Set the new state back into the store
  store.setState(newState)

  return true
}

export default moveItem
