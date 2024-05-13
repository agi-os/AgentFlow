import Item from '../Item'
import TypedItemsView from './TypedItemsView'

/**
 * Renders a detailed view of typed items.
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data containing items.
 * @returns {JSX.Element} The rendered component.
 */

const DetailedView = ({ data }) => {
  const classNames = ['grid', 'grid-cols-3', 'p-4', 'gap-2', 'text-md']

  return (
    <TypedItemsView data={data}>
      {items => (
        <div className={classNames.join(' ')}>
          {items.map(item => (
            <Item key={item.id} item={item} />
          ))}
        </div>
      )}
    </TypedItemsView>
  )
}

export default DetailedView
