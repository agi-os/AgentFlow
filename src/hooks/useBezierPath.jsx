import { useState, useEffect } from 'react'
import useTransportBeltStore from './useTransportBeltStore'
import { getBezierPath } from '@xyflow/react'

/**
 * Custom hook to calculate and update the Bezier path for a transport belt.
 *
 * @param {Object} props - The properties for the hook.
 * @param {number} props.sourceX - The x-coordinate of the source node.
 * @param {number} props.sourceY - The y-coordinate of the source node.
 * @param {number} props.targetX - The x-coordinate of the target node.
 * @param {number} props.targetY - The y-coordinate of the target node.
 * @param {string} props.sourcePosition - The position of the source node.
 * @param {string} props.targetPosition - The position of the target node.
 * @param {string} props.edgeId - The ID of the edge.
 * @returns {void}
 */
const useBezierPath = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  edgeId,
}) => {
  // State to hold the calculated Bezier path
  const [_, setPathD] = useState('')

  // Destructure the setPathD function from the transport belt store
  const { setPathD: setStorePathD } = useTransportBeltStore(edgeId)

  // useEffect hook to calculate the Bezier path whenever the source or target coordinates or positions change
  useEffect(() => {
    // Calculate the new Bezier path using the getBezierPath function
    const [newPathD] = getBezierPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
    })

    // Update the pathD state with the new Bezier path
    setPathD(newPathD)

    // Update the store's pathD with the new Bezier path
    setStorePathD(newPathD)
  }, [sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition])
}

export default useBezierPath
