import { useState, useRef, useEffect } from 'react'
import { getBezierPath } from '@xyflow/system'

/**
 * How many times per second should the target coordinate be updated.
 * The higher the number, the more precise is the path following.
 */
const CALCULATIONS_PER_SECOND = 3

/**
 * How many items should flow down the path per minute.
 */
const ITEMS_PER_MINUTE = 8

/**
 * Custom hook that animates a circle along a bezier path.
 *
 * @param {number} sourceX - The x-coordinate of the source point.
 * @param {number} sourceY - The y-coordinate of the source point.
 * @param {number} targetX - The x-coordinate of the target point.
 * @param {number} targetY - The y-coordinate of the target point.
 * @param {string} sourcePosition - The position of the source point relative to the element it belongs to.
 * @param {string} targetPosition - The position of the target point relative to the element it belongs to.
 * @param {number} itemsPerMinute - How many items should flow down the path per minute.
 * @param {number} calculationsPerSecond - How many times per second should the target coordinate be updated.
 * @returns {Object} - An object containing references to the path and circle elements, and the path's d attribute value.
 */
const usePathAnimation = (
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition
) => {
  // Create refs for all the elements we need to animate
  const pathRef = useRef(null)
  const divRef = useRef(null)

  // Prepare all stores for the animation

  // Path's d attribute value
  const [pathD, setPathD] = useState('')
  useEffect(() => {
    // Get the path's d attribute value
    const [pathD] = getBezierPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
    })
    setPathD(pathD)
  }, [sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition])

  // Items per minute and the number of calculations per second
  const [itemsPerMinute, setItemsPerMinute] = useState(ITEMS_PER_MINUTE)

  // Number of calculations per second
  const [calculationsPerSecond, setCalculationsPerSecond] = useState(
    CALCULATIONS_PER_SECOND
  )

  // Current location in percentage of the path (0.00 - 1.00)
  const [currentPercentage, setCurrentPercentage] = useState(0)

  // Full length of the SVG path
  const [totalPathLength, setTotalPathLength] = useState(
    pathRef?.current?.getTotalLength?.() || 0
  )

  // Current point in px of the item along the path
  const currentPointPixels = totalPathLength * currentPercentage

  // Speed of an item per second in pixels
  const itemSpeedPerSecond = totalPathLength / (itemsPerMinute / 60)

  // Time it takes for one item to traverse the entire path in seconds
  const timeForOneItemInSeconds = totalPathLength / itemSpeedPerSecond

  // Convert time to minutes to get dashSpeed
  const dashSpeed = timeForOneItemInSeconds / 60

  // Items per second and the number of frames per item
  const itemsPerSecond = itemsPerMinute / 60

  // Number of frames per item and the percentage of the path to move per frame
  const framesPerItem = calculationsPerSecond / itemsPerSecond

  // Percentage of the path to move per frame
  const percentagePerFrame = 100 / framesPerItem

  // Number of milliseconds per frame for the expected calculations per second
  const msPerFrame = (1000 / calculationsPerSecond) | 0

  // Did the item reach the end of the path?
  const reachedEnd = currentPointPixels >= totalPathLength

  useEffect(() => {
    if (!divRef?.current?.style) return

    if (reachedEnd) {
      // Reset the index and location without transition delay
      divRef.current.style.transition = 'none'
      divRef.current.style.opacity = 0
    }
  }, [divRef, reachedEnd])

  // Update the total path length when the path changes
  useEffect(() => {
    // Get the total length of the path
    const length = pathRef?.current?.getTotalLength?.() || 0
    setTotalPathLength(length)
  }, [pathD])

  // If path reached the end, reset the current point to 0
  useEffect(() => {
    if (currentPointPixels >= totalPathLength) {
      setCurrentPercentage(0)
    }
  }, [totalPathLength, currentPointPixels])

  // On each change of the current point, update the div's position
  useEffect(() => {
    if (!divRef.current) return

    // Get the current point on the path
    const targetPoint = pathRef.current.getPointAtLength(currentPointPixels)

    // Get a point slightly back on the path
    const lastPoint = pathRef.current.getPointAtLength(currentPointPixels - 1)

    // Calculate the slope of the curve at the current point
    const deltaY = targetPoint.y - lastPoint.y
    const deltaX = targetPoint.x - lastPoint.x

    // Calculate the angle of rotation from the slope
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) - 90

    // Use only the integer parts to keep it simple in the DOM
    const trimmedX = targetPoint.x | 0
    const trimmedY = targetPoint.y | 0
    const trimmedAngle = angle | 0

    // Slow down the msPerFrame for 5% to prevent abrupt path changes when reaching the end too quickly
    const slowedDownMsPerFrame = (msPerFrame * 1.05) | 0

    // Move div along the path
    divRef.current.style.transition = `transform ${slowedDownMsPerFrame}ms linear`
    divRef.current.style.opacity = 1
    divRef.current.style.transform = `translate(${trimmedX}px, ${trimmedY}px) rotate(${trimmedAngle}deg)`
  }, [currentPointPixels, msPerFrame])

  // Start the animation
  useEffect(() => {
    return runAnimation({
      pathRef,
      divRef,
      currentPercentage,
      setCurrentPercentage,
      percentagePerFrame,
      msPerFrame,
      itemsPerMinute,
      reachedEnd,
    })
  }, [
    pathRef,
    divRef,
    currentPercentage,
    setCurrentPercentage,
    percentagePerFrame,
    msPerFrame,
    itemsPerMinute,
    reachedEnd,
  ])

  // Return the refs and the path's d attribute value
  return { pathRef, pathD, divRef, dashSpeed }
}

export default usePathAnimation

const runAnimation = ({
  pathRef,
  divRef,
  currentPercentage,
  setCurrentPercentage,
  percentagePerFrame,
  msPerFrame,
  itemsPerMinute,
  reachedEnd,
}) => {
  // Animation frame reference
  let frameIdRef = null

  // Initialize next tick timestamp
  let nextTick = performance.now() + msPerFrame

  const animate = itemsPerMinute => {
    // Sanity check
    if (!pathRef.current || !divRef.current) return

    // Get the current timestamp
    const now = performance.now() | 0

    if (now < nextTick) {
      // It's not time for the next frame yet, schedule another check
      frameIdRef = requestAnimationFrame(() => animate(itemsPerMinute))
      return
    }

    // Update next tick timestamp
    nextTick = now + msPerFrame

    if (reachedEnd) {
      // If the item reached the end of the path, reset the index and location
      setCurrentPercentage(0)
    } else {
      // Increment the current point index
      setCurrentPercentage(currentPercentage + percentagePerFrame / 100)
    }

    // Request the next frame
    frameIdRef = requestAnimationFrame(() => animate(itemsPerMinute))
  }

  // Start the animation
  frameIdRef = requestAnimationFrame(() => animate(itemsPerMinute))

  // Cancel the animation frame when the component re-renders or unmounts
  return () => {
    // TODO: debug this inefficiency, it should not be killing the loop on each render
    // console.log('Cancelling animation frame', frameIdRef)
    if (frameIdRef !== null) {
      cancelAnimationFrame(frameIdRef)
    }
  }
}
