/**
 * Renders a summary item.
 *
 * @param {Object} props - The component props.
 * @param {string} props.type - The type of the item.
 * @param {Array} props.items - The items of this type.
 * @returns {JSX.Element} The rendered summary item.
 */

const SummaryItem = ({ type, items }) => (
  <div
    className={classNames.join(' ')}
    title={`${items.length}× ${type} ${items[0].emoticon}`}>
    <span>{items.length}×</span>
    <div>
      {items[0].emoticon}
      {type.slice(0, 2).toUpperCase()}
    </div>
  </div>
)

const classNames = [
  'w-12',
  'h-12',
  'flex',
  'flex-col',
  'justify-center',
  'items-center',
  'border',
  'border-zinc-700',
  'text-zinc-400',
  'rounded',
  'text-sm',
  'shadow-md',
]

export default SummaryItem
