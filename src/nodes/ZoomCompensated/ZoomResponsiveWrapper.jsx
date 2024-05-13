import { useEffect, useRef, useState } from 'react'
import { useStore } from '@xyflow/react'

/**
 * Retrieves the parent element of a given element at a specified depth.
 *
 * @param {HTMLElement} element - The element for which to find the parent.
 * @param {number} depth - The depth at which to find the parent element.
 * @returns {HTMLElement|null} - The parent element at the specified depth, or null if not found.
 */
const getParentElement = (element, depth) => {
  let currentElement = element
  for (let i = 0; i < depth; i++) {
    currentElement = currentElement?.parentElement
    if (!currentElement) break
  }
  return currentElement
}

/**
 * Wrapper component that adjusts its dimensions based on the zoom level of its parent element.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child elements to be rendered inside the wrapper.
 * @param {string[]} [props.classNames=[]] - Additional CSS class names to be applied to the wrapper.
 * @param {number} [props.depth=3] - The depth of the parent element to calculate dimensions from.
 * @returns {JSX.Element} The rendered wrapper component.
 */
const ZoomResponsiveWrapper = ({ children, classNames = [], depth = 3 }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const ref = useRef()

  // Get the zoom level from the store
  const [, , z] = useStore(s => s.transform)

  // On any change to the zoom level, update the width and height from the parent's parent element

  useEffect(() => {
    const parentBounding = getParentElement(
      ref.current,
      depth
    )?.getBoundingClientRect()
    if (parentBounding) {
      setDimensions({
        width: parentBounding.width,
        height: parentBounding.height,
      })
    }
  }, [z, depth])

  return (
    <div className={classNames?.join(' ')} style={dimensions} ref={ref}>
      {children}
    </div>
  )
}

export default ZoomResponsiveWrapper
