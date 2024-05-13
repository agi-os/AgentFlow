/**
 * Renders the title for a specific type of items.
 * @param {Object} props - The component props.
 * @param {string} props.type - The type of items.
 * @param {Array} props.items - The array of items.
 * @returns {JSX.Element} The rendered component.
 */
const TypeTitle = ({ type, items }) => (
  <div className={classNames.join(' ')}>
    {items[0].emoticon} {type} ({items.length})
  </div>
)

const classNames = ['px-2', 'py-3', 'rounded', 'text-lg']

export default TypeTitle
