/**
 * Calculates the bucket centers based on the path length and bucket size.
 *
 * @param {number} length - The total length of the path.
 * @param {number} bucketSize - The size of each bucket.
 * @param {SVGPathElement} pathRef - The reference to the path element.
 * @returns {Array<{x: number, y: number}>} An array of bucket centers.
 */
const calculateBucketCenters = (length, bucketSize, pathRef) => {
  const totalBuckets = calculateTotalBuckets(length, bucketSize)
  return generateBucketCenters(totalBuckets, length, pathRef)
}

/**
 * Calculates the total number of buckets based on the path length and bucket size.
 *
 * @param {number} length - The total length of the path.
 * @param {number} bucketSize - The size of each bucket.
 * @returns {number} The total number of buckets.
 */
const calculateTotalBuckets = (length, bucketSize) => {
  return Math.ceil(length / bucketSize)
}

/**
 * Generates an array of bucket centers based on the total number of buckets, path length, and path reference.
 *
 * @param {number} totalBuckets - The total number of buckets.
 * @param {number} length - The total length of the path.
 * @param {SVGPathElement} pathRef - The reference to the path element.
 * @returns {Array<{x: number, y: number}>} An array of bucket centers.
 */
const generateBucketCenters = (totalBuckets, length, pathRef) => {
  return Array.from({ length: totalBuckets }, (_, i) => {
    const distance = (i + 0.5) * (length / totalBuckets)
    const point = pathRef.getPointAtLength(distance)
    return {
      x: Math.round(point.x * 100) / 100,
      y: Math.round(point.y * 100) / 100,
    }
  })
}

export default calculateBucketCenters
