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

  // If the item does not exist, return false
  if (!store.getState().getItem(itemId)) return false

  // Get the entities from the store
  const fromEntity = store.getState()[`${fromType}Lookup`].get(fromId)
  const toEntity = store.getState()[`${toType}Lookup`].get(toId)

  // If either entity does not exist, return false
  if (!fromEntity || !toEntity) return false

  // If the fromEntity does not have the item, return false
  if (!fromEntity?.data?.items?.includes(itemId)) return false

  // If the target does not have the data property, add it
  if (!toEntity.data) toEntity.data = {}

  // If the target does not have the items property, add it
  if (!toEntity.data.items) toEntity.data.items = []

  // If the toEntity already has the item, return false
  if (toEntity?.data?.items?.includes(itemId)) return false

  // Remove the item from the fromEntity
  const newFromEntityData = {
    ...fromEntity.data,
    items: fromEntity.data.items.filter(i => i !== itemId),
  }

  // Add the item to the toEntity
  const newToEntityData = {
    ...toEntity.data,
    items: [...(toEntity?.data?.items || []), itemId],
  }

  // Update only the individual entities directly bypassing the lookup
  store.setState(draft => {
    draft[fromType + 's'] = draft[fromType + 's'].map(e =>
      e.id === fromId ? { ...e, data: newFromEntityData } : e
    )

    draft[toType + 's'] = draft[toType + 's'].map(e =>
      e.id === toId ? { ...e, data: newToEntityData } : e
    )

    return draft
  })

  return true
}

export default moveItem
