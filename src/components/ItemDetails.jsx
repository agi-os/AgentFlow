import { useStore } from '@xyflow/react'

/**
 * Renders the details of an item.
 * @param {Object} props - The component props.
 * @param {Object} props.item - The item object containing details.
 * @param {string} props.itemId - The unique identifier for the item.
 * @param {string[]} props.classNames - The class names for the item details.
 * @returns {JSX.Element} The rendered item details component.
 */
const ItemDetails = ({
  itemId,
  classNames = [
    'border-t',
    'border-zinc-700',
    'grid',
    'grid-cols-[1fr,2fr]',
    'gap-x-2',
    'p-2',
    'text-[0.5rem]',
  ],
}) => {
  // Get current zoom level
  const zoom = useStore(store => store.transform[2])

  // Get the item details
  const item = useStore(store => store.getItem(itemId))

  // Adjust the font size based on the zoom level
  const fontSize = zoom > 10 ? 100 - 3 * zoom + '%' : ''

  // Return the item details
  return (
    <div x-id={itemId} className={classNames.join(' ')} style={{ fontSize }}>
      {Object.keys(item)
        .filter(key => !['type', 'emoji', 'id', 'location'].includes(key))
        .map(key => [
          <div x-id={itemId} key={key}>
            {key}
          </div>,
          <div x-id={itemId} key={key + 'v'}>
            {typeof item[key] === 'object' && item[key] !== null
              ? Object.entries(item[key]).map(([subKey, subValue]) => (
                  <div key={subKey}>
                    {subKey}: {subValue}
                  </div>
                ))
              : item[key]}
          </div>,
        ])}
    </div>
  )
}

export default ItemDetails
