/**
 * Group items by type.
 *
 * @param {Array} items - The items to group.
 * @returns {Object} The grouped items.
 */

const groupItemsByType = items => {
  return items?.reduce((acc, item) => {
    const type = item.type
    acc[type] = acc[type] || []
    acc[type].push(item)
    return acc
  }, {})
}

export default groupItemsByType
