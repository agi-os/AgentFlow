import ZoomResponsiveWrapper from '../../ZoomCompensated/ZoomResponsiveWrapper'
import TypeTitle from './TypeTitle'

/**
 * Renders a view for typed items.
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data containing the items.
 * @param {Function} props.children - The function to render the items.
 * @returns {JSX.Element} The rendered component.
 */
const TypedItemsView = ({ data, children }) => {
  const typedItems = data?.items?.reduce((acc, item) => {
    const type = item.type
    acc[type] = acc[type] || []
    acc[type].push(item)
    return acc
  }, {})

  return (
    <ZoomResponsiveWrapper className={classNames}>
      {typedItems &&
        Object.entries(typedItems).map(([type, items]) => (
          <div key={type}>
            <TypeTitle type={type} items={items} />
            {children(items)}
          </div>
        ))}
    </ZoomResponsiveWrapper>
  )
}

const classNames = [
  'flex',
  'flex-wrap',
  'content-start',
  'bg-zinc-800',
  'rounded',
  'gap-2',
  'p-5',
  'overflow-y-auto',
]

export default TypedItemsView
