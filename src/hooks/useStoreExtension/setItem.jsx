/**
 * Sets an item in the store.
 * @param {Object} options - The options for adding an item.
 * @param {Object} options.store - The store object.
 * @param {Object} options.item - The item to be added.
 */
const setItem = ({ store, item }) => {
  // If we have an id, check if the item already exists
  if (item?.id) {
    // If item exists, remove it
    store.setState(draft => ({
      ...draft,
      items: draft.items.filter(i => i.id !== item.id),
    }))
  }

  // If item has no id, generate one
  if (!item.id) item.id = store.getState().generateId()

  // If item has no location, assign it to the last itemChest
  if (!item.location) {
    // Find the last itemChest node
    const lastItemChest = store
      .getState()
      .nodes.filter(i => i.type === 'itemChest')
      .pop()

    // Set the location to the last itemChest's id with a random queue progression
    item.location = {
      id: lastItemChest?.id,
      distance: 0 + Math.random() * 0.1,
      deliveryTime: new Date().getTime(),
    }
  }

  // Push the item to the store
  store.setState(draft => ({
    ...draft,
    items: [...draft.items, item],
  }))

  // Update the item lookup map
  store.getState().updateItemLookup()

  // Update the item location lookup map
  store.getState().updateItemLocationLookup()
}

export default setItem
