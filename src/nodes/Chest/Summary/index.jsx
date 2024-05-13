import groupItemsByType from './groupItemsByType'
import SummaryItem from './SummaryItem'
import ZoomResponsiveWrapper from '../../ZoomCompensated/ZoomResponsiveWrapper'

/**
 * Renders a summary view of typed items.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data containing items.
 * @returns {JSX.Element} The rendered summary view.
 */
const SummaryView = ({ data }) => {
  // Get items grouped by type.
  const typedItems = groupItemsByType(data?.items)

  // Render the summary view.
  return (
    <ZoomResponsiveWrapper classNames={classNames}>
      {typedItems ? (
        Object.entries(typedItems).map(([type, items], index) => (
          <SummaryItem key={index} type={type} items={items} />
        ))
      ) : (
        <div className="text-zinc-400">Empty</div>
      )}
    </ZoomResponsiveWrapper>
  )
}

const classNames = [
  'flex',
  'flex-wrap',
  'content-start',
  'justify-start',
  'gap-2',
  'p-2',
]

export default SummaryView
