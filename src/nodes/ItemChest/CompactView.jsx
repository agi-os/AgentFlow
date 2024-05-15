/**
 * Renders a compact view of items in a grid layout.
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data containing the item IDs.
 * @param {Object} props.dimensions - The dimensions of the compact view.
 * @param {number} props.compactLimit - The compact limit value.
 * @returns {JSX.Element} The rendered compact view component.
 */
const CompactView = ({ data, dimensions, compactLimit }) => {
  const { width, height } = dimensions
  const zoomFactor = 1 - (compactLimit - (width + height)) / compactLimit

  // Get the items from the store
  const getItem = useStore(s => s.getItem)
  const items = data?.items?.map(id => getItem(id))

  // Render the items in a compact grid
  return (
    <div
      style={{
        transform: `scale(${zoomFactor})`,
        transformOrigin: 'top left',
        width: `${width / zoomFactor}px`,
      }}
      className="flex flex-wrap gap-1 pl-3 pt-3">
      {items?.map((item, index) => (
        <div key={index} x-id={item.id}>
          {item.emoticon}
        </div>
      ))}
    </div>
  )
}

import { useStore } from '@xyflow/react'

export default CompactView
