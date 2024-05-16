import { Fragment } from 'react'
/**
 * Component for displaying the zoomed-in content of an item.
 * @param {Object} props - The component props.
 * @param {Object} props.item - The item to display.
 * @returns {JSX.Element} The rendered component.
 */
const SuperZoom = ({ item }) => {
  // Remove the internal data not useful to the end user
  // eslint-disable-next-line no-unused-vars
  const { location, ...rest } = item

  // Render the item's content
  return (
    <div x-id={item.id} className={classNames.join(' ')}>
      <div className={classNames2.join(' ')}>
        {Object.entries(rest).map(([key, value]) => (
          <Fragment key={key}>
            <div className="text-[0.08rem] font-semibold  text-right">
              {key}:
            </div>
            <div className="text-[0.09rem] text-left">{value}</div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default SuperZoom

const classNames = [
  'grid',
  'place-items-center',
  'absolute',
  'bg-zinc-900',
  'bg-opacity-95',
  'inset-0',
  'text-zinc-100',
  'rounded-full',
]

const classNames2 = [
  'grid',
  'grid-cols-[4fr_7fr]',
  'gap-x-[0.05rem]',
  'gap-y-[0.065rem]',
  'leading-none',
]
