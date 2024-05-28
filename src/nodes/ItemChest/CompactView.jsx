import useNodeItems from '../../hooks/useNodeItems'

/**
 * Renders a compact view of items in a grid layout.
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data containing the item IDs.
 * @param {Object} props.dimensions - The dimensions of the compact view.
 * @param {number} props.compactLimit - The compact limit value.
 * @returns {JSX.Element} The rendered compact view component.
 */
const CompactView = ({ dimensions, compactLimit }) => {
  const { width, height } = dimensions
  const zoomFactor = 1 - (compactLimit - (width + height)) / compactLimit

  // Get all items at this location
  const items = useNodeItems()

  // Prepare the class names
  const classNames = ['flex', 'flex-wrap', 'gap-1', 'pl-3', 'pt-3']

  // Prepare the styles
  const style = {
    transform: `scale(${zoomFactor})`,
    transformOrigin: 'top left',
    width: `${width / zoomFactor}px`,
  }

  // Render the items in a compact grid
  return (
    <div style={style} className={classNames.join(' ')}>
      {items?.map((item, index) => (
        <div key={index} x-node-id={item.id}>
          {item.emoji}
        </div>
      ))}
    </div>
  )
}

export default CompactView
