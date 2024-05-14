import { useRef, useEffect } from 'react'
import { getBezierPath } from '@xyflow/system'

/**
 * How many times per second should the target coordinate be updated.
 * The higher the number, the more precise is the path following.
 */
const CALCULATIONS_PER_SECOND = 30

/**
 * How many items should flow down the path per minute.
 */
const ITEMS_PER_MINUTE = 12

// pre-calculate some values
const msPerFrame = (1000 / CALCULATIONS_PER_SECOND) | 0
const itemsPerSecond = (ITEMS_PER_MINUTE / 60) * CALCULATIONS_PER_SECOND
const framesPerItem = CALCULATIONS_PER_SECOND / itemsPerSecond
const percentagePerFrame = 100 / framesPerItem / 5

/**
 * Custom hook that animates a circle along a bezier path.
 *
 * @param {number} sourceX - The x-coordinate of the source point.
 * @param {number} sourceY - The y-coordinate of the source point.
 * @param {number} targetX - The x-coordinate of the target point.
 * @param {number} targetY - The y-coordinate of the target point.
 * @param {string} sourcePosition - The position of the source point relative to the element it belongs to.
 * @param {string} targetPosition - The position of the target point relative to the element it belongs to.
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

  // Get the path's d attribute value
  const [pathD] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  // Current point in px of the item along the path
  const currentPointPixels = useRef(0)

  // Animation frame ID
  const frameIdRef = useRef(null)

  // Start the animation
  useEffect(() => {
    // Initialize next tick timestamp
    let nextTick = performance.now() + msPerFrame

    const animate = itemsPerMinute => {
      // Sanity check
      if (!pathRef.current || !divRef.current) return

      // Get the current timestamp
      const now = performance.now() | 0

      if (now < nextTick) {
        // It's not time for the next frame yet, schedule another check
        frameIdRef.current = requestAnimationFrame(() =>
          animate(itemsPerMinute)
        )
        return
      }

      // Update next tick timestamp
      nextTick = now + msPerFrame

      // Get the total length of the path
      const totalPathLength = pathRef.current.getTotalLength()

      // Did the item reach the end of the path?
      const reachedEnd = currentPointPixels.current >= totalPathLength

      // If the item reached the end of the path, reset the index and location
      if (reachedEnd) {
        // Get the current opacity of the item
        const opacity = parseInt(divRef.current.style.opacity)

        // If we did not yet reset the index and fade out the item
        if (opacity === 1) {
          // Fade out the item
          divRef.current.style.opacity = 0
        } else {
          // Reset the index and location without transition delay
          divRef.current.style.transition = 'none'
          divRef.current.style.transform = `translate(${sourceX}px, ${sourceY}px)`
          currentPointPixels.current = 0
        }
      } else {
        // Increment the current point index
        currentPointPixels.current += percentagePerFrame

        // Get the current point on the path
        const targetPoint = pathRef.current.getPointAtLength(
          currentPointPixels.current
        )

        // Get a point slightly ahead on the path
        const nextPoint = pathRef.current.getPointAtLength(
          currentPointPixels.current + 1
        )

        // Calculate the slope of the curve at the current point
        const deltaY = nextPoint.y - targetPoint.y
        const deltaX = nextPoint.x - targetPoint.x

        // Calculate the angle of rotation from the slope
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) - 90

        // Move div along the path
        divRef.current.style.transition = `transform ${msPerFrame}ms linear`
        divRef.current.style.opacity = 1
        divRef.current.style.transform = `translate(${targetPoint.x}px, ${targetPoint.y}px) rotate(${angle}deg)`
      }

      // Request the next frame
      frameIdRef.current = requestAnimationFrame(() => animate(itemsPerMinute))
    }

    // Start the animation
    frameIdRef.current = requestAnimationFrame(() => animate(ITEMS_PER_MINUTE))

    // Cancel the animation frame when the component re-renders or unmounts
    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current)
      }
    }
  }, [pathD, sourceX, sourceY])

  // Return the refs and the path's d attribute value
  return { pathRef, pathD, divRef }
}

export default usePathAnimation
