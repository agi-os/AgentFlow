/**
 * Takes an array of items and creates an object with the count of each item type. *
 * @param {Array} items - An array of items with a 'type' property.
 * @returns {Array} An array of objects with 'name' and 'count' properties representing the count of each item type.
 */
export const createItemTypes = items => {
  const typeCounts = items.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = { count: 0, emoji: item.emoji || '❓' } // Default emoji if none provided
    }
    acc[item.type].count += 1
    return acc
  }, {})

  return Object.keys(typeCounts).map(type => ({
    name: type,
    count: typeCounts[type].count,
    emoji: typeCounts[type].emoji,
  }))
}

/**
 * Splits a grid into rows of a specified length.
 *
 * @param {Array} grid - The grid to split into rows.
 * @param {number} rowLength - The length of each row.
 * @returns {Array} An array of arrays, each representing a row of the grid.
 */
export const splitGrid = (grid, rowLength) => {
  const result = []
  for (let i = 0; i < grid.length; i += rowLength) {
    result.push(grid.slice(i, i + rowLength))
  }
  return result
}
