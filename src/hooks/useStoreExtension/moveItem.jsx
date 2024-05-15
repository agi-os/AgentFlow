/**
 * Move an item from one entity to another.
 * @param {Object} store - The store object.
 * @param {string} itemId - The ID of the item to move.
 * @param {string} fromId - The ID of the entity to move the item from.
 * @param {string} toId - The ID of the entity to move the item to.
 * @param {string} fromType - The type of the entity to move the item from (node or edge).
 * @param {string} toType - The type of the entity to move the item to (node or edge).
 * @returns {boolean} True if the item was moved successfully, false otherwise.
 */
const moveItem = (store, itemId, fromId, toId, fromType, toType) => {
  // If the item does not exist, return false
  if (!store.getState().getItem(itemId)) return false

  // Get the entities from the store
  const fromEntity = store.getState()[`${fromType}Lookup`].get(fromId)
  const toEntity = store.getState()[`${toType}Lookup`].get(toId)

  // If either entity does not exist, return false
  if (!fromEntity || !toEntity) return false

  // If the fromEntity does not have the item, return false
  if (!fromEntity.data.items.includes(itemId)) return false

  // If the toEntity already has the item, return false
  if (toEntity.data.items.includes(itemId)) return false

  // Remove the item from the fromEntity
  const newFromEntityData = {
    ...fromEntity.data,
    items: fromEntity.data.items.filter(i => i !== itemId),
  }

  // Add the item to the toEntity
  const newToEntityData = {
    ...toEntity.data,
    items: [...toEntity.data.items, itemId],
  }

  // Update the entities with the new item lists
  store.setState(prevState => ({
    ...prevState,
    [fromType + 's']: prevState[fromType + 's'].map(e =>
      e.id === fromId ? { ...e, data: newFromEntityData } : e
    ),
    [toType + 's']: prevState[toType + 's'].map(e =>
      e.id === toId ? { ...e, data: newToEntityData } : e
    ),
  }))

  return true
}

export default moveItem
