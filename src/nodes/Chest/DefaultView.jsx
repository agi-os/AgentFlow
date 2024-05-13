import TypedItemsView from './TypedItemsView'

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
            <p className="font-bold">{item.name}</p>
          </div>
        ))}
      </div>
    )}
  </TypedItemsView>
)

const gridClassNames = [
  'grid',
  'grid-cols-3',
  'p-1',
  'gap-1',
  'rounded',
  'border',
  'border-zinc-700',
]

const itemClassNames = ['subgrid', 'px-2', 'gap-2', 'rounded', 'bg-zinc-700']

export default DefaultView
