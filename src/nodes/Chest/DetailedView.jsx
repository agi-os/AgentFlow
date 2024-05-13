import {
  innerDivClassNames,
  typeClassNames,
  itemClassNames,
} from './classNames'

/**
 * Renders a detailed view of typed items.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data containing items.
 * @returns {JSX.Element} The rendered component.
 */
export const DetailedView = ({ data }) => {
  const typedItems = data?.items?.reduce((acc, item) => {
    const type = item.type
    acc[type] = acc[type] || []
    acc[type].push(item)
    return acc
  }, {})

  return (
    <div className={innerDivClassNames}>
      {typedItems &&
        Object.entries(typedItems).map(([type, items]) => (
          <div key={type}>
            <div className={typeClassNames}>
              {type} ({items.length})
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {items.map(item => (
                <div className={itemClassNames} key={item.id}>
                  <p className="font-bold">{item.name}</p>
                  <p>{item.phone}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}

export default DetailedView
