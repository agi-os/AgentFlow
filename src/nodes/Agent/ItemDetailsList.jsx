import { useMemo } from 'react'
import ItemDetails from '../../components/ItemDetails'

/**
 * Render a list of ItemDetails components based on the provided items array.
 * @param {Array} items - An array of items to render details for.
 * @param {string} className - Additional class name for the container div.
 * @returns {JSX.Element} A div element containing a list of ItemDetails components.
 */
const ItemDetailsList = ({ items = [], className }) => {
  const memoizedItems = useMemo(
    () =>
      items.map(item => (
        <ItemDetails key={`item-${item.id}`} itemId={item.id} />
      )),
    [items]
  )

  return (
    <div
      className={`relative h-28 overflow-y-auto overflow-x-hidden ${className}`}>
      {memoizedItems}
    </div>
  )
}

export default ItemDetailsList
