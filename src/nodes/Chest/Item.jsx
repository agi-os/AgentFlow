/**
 * Renders an item with its name and phone number.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.item - The item object containing name and phone properties.
 * @returns {JSX.Element} The rendered Item component.
 */
const Item = ({ item }) => {
  const itemClassNames = [
    'p-1',
    'gap-0',
    'rounded',
    'border',
    'border-zinc-700',
  ]
  return (
    <div className={itemClassNames.join(' ')} key={item.id}>
      <p className="font-bold">{item.name}</p>
      <p>{item.phone}</p>
    </div>
  )
}

export default Item
