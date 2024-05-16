import CounterView from './CounterView'
import CompactView from './CompactView'

/**
 * Renders the body of the chest component.
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data object containing items.
 * @param {Object} props.dimensions - The dimensions object containing width and height.
 * @returns {JSX.Element} The rendered component.
 */
const ChestBody = ({ dimensions }) => {
  // Get dimensions provided by the parent zoom responsive wrapper
  const { width, height } = dimensions

  // When the width+hight become too small, switch to a compact grid and zoom out to fit
  const compactLimit = 600

  if (width + height < compactLimit) {
    return <CompactView dimensions={dimensions} compactLimit={compactLimit} />
  }

  return <CounterView dimensions={dimensions} />
}

export default ChestBody
