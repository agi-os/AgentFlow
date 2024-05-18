import { tailwindClassMap, classNames } from './constants'

/**
 * Creates class names based on the provided parameters.
 * @param {Object} props - The properties of the handle.
 * @param {string} props.corner - The corner of the handle.
 * @param {string} props.edge - The edge of the handle.
 * @returns {string[]} - The array of class names.
 */
const createClassNames = ({ corner = 'topLeft', edge = 'top' }) => {
  // Get the corresponding class names from the tailwind class map
  const fromMap = tailwindClassMap[`${corner}-${edge}`]

  return [...classNames, ...fromMap]
}

export default createClassNames
