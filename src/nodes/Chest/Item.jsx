/**
 * Renders an item with its name and all keys not in hiddenKeys.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.item - The item object containing name and phone properties.
 * @returns {JSX.Element} The rendered Item component.
 */
const Item = ({ item }) => {
  return (
    <div className={itemClassNames.join(' ')} key={item.id}>
      <p className="font-bold">{item.name}</p>
      {Object.keys(item)
        .filter(key => !hiddenKeys.includes(key))
        .map(key => (
          <p key={key}>
            <span className="font-bold">{key}:</span> {item[key]}
          </p>
        ))}
    </div>
  )
}

const hiddenKeys = ['id', 'name', 'type', 'emoticon']

const itemClassNames = ['p-1', 'gap-0', 'rounded', 'border', 'border-zinc-700']

export default Item
