import TypedItemsView from './Detailed/TypedItemsView'

/**
 * Renders the default view for the Chest node.
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data containing items.
 * @returns {JSX.Element} The rendered component.
 */

const DefaultView = ({ data }) => (
  <TypedItemsView data={data}>
    {items => (
      <div className={gridClassNames.join(' ')}>
        {items.map(item => (
          <div className={itemClassNames.join(' ')} key={item.id}>
            {item.name}
          </div>
        ))}
      </div>
    )}
  </TypedItemsView>
)

const gridClassNames = ['grid', 'grid-cols-4', 'p-2', 'gap-2', 'rounded']

const itemClassNames = [
  'subgrid',
  'font-light',
  'px-2',
  'gap-2',
  'rounded',
  'border',
  'border-zinc-700',
  'bg-zinc-800',
]

export default DefaultView
