import groupItemsByType from './groupItemsByType'
import SummaryItem from './SummaryItem'

const classNames = ['flex', 'flex-wrap', 'gap-2', 'w-full', 'h-full', 'p-2']

/**
 * Renders a summary view of typed items.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data containing items.
 * @returns {JSX.Element} The rendered summary view.
 */
const SummaryView = ({ data }) => {
  const typedItems = groupItemsByType(data?.items)

  return (
    <div className={classNames.join(' ')}>
      {Object.entries(typedItems).map(([type, items], index) => (
        <SummaryItem key={index} type={type} items={items} />
      ))}
    </div>
  )
}

export default SummaryView
