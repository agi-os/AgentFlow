/**
 * Calculates the total length of the path.
 *
 * @param {SVGPathElement} pathRef - The reference to the path element.
 * @returns {number} The total length of the path rounded to 2 decimals.
 */
const calculateLength = pathRef => {
  return Math.round(pathRef.getTotalLength() * 100) / 100
}

export default calculateLength
