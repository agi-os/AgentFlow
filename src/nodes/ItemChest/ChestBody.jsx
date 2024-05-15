/**
 * Renders the body of the chest component.
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data object containing items.
 * @param {Object} props.dimensions - The dimensions object containing width and height.
 * @returns {JSX.Element} The rendered component.
 */
const ChestBody = ({ data, dimensions }) => {
  // Get dimensions provided by the parent zoom responsive wrapper
  const { width, height } = dimensions

  // When the width+hight become too small, switch to a compact grid and zoom out to fit
  const compactLimit = 600

  if (width + height < compactLimit) {
    return (
      <CompactView
        data={data}
        dimensions={dimensions}
        compactLimit={compactLimit}
      />
    )
  }

  return <CounterView data={data} dimensions={dimensions} />
}

import CounterView from './CounterView'
import CompactView from './CompactView'

export default ChestBody
