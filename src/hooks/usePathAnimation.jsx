import { useRef, useEffect } from 'react'
import { getBezierPath } from '@xyflow/system'

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

  const directionRef = useRef(1) // 1 for forward, -1 for backward
  const currentPointIndexRef = useRef(0) // Initialize to 0
  const frameIdRef = useRef(null) // Store frame ID

  useEffect(() => {
    let animationFrameCounter = 0 // Initialize animation frame counter

    const TRANSITION_DURATION_MS = 500 // Duration of a single straight segment of transition in milliseconds
    const framesPerTransition = (TRANSITION_DURATION_MS / 17) | 0 // Number of frames in a single straight segment of transition

    const animate = () => {
      if (pathRef.current) {
        animationFrameCounter++ // Increment animation frame counter

        // Update circle position every framesPerTransition frames
        if (animationFrameCounter % framesPerTransition === 0) {
          const totalPathLength = pathRef.current.getTotalLength()

          // Check if the animation has reached the end of the path in either direction
          if (
            (directionRef.current === 1 &&
              currentPointIndexRef.current >= totalPathLength) ||
            (directionRef.current === -1 && currentPointIndexRef.current <= 0)
          ) {
            directionRef.current *= -1 // Reverse direction
          }

          // Get the current point on the path
          const targetPoint = pathRef.current.getPointAtLength(
            currentPointIndexRef.current
          )

          // Move div along with circle
          if (divRef.current) {
            divRef.current.style.transform = `translate(${targetPoint.x}px, ${targetPoint.y}px)`
          }

          // Move to the next point based on direction and frames per transition
          currentPointIndexRef.current +=
            framesPerTransition * directionRef.current
        }

        frameIdRef.current = requestAnimationFrame(animate)
      }
    }
    frameIdRef.current = requestAnimationFrame(animate)

    // Cancel the animation frame when the component re-renders or unmounts
    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current)
      }
    }
  }, [pathD])

  return { pathRef, pathD, divRef }
}

export default usePathAnimation
