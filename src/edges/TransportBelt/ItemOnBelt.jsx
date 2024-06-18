import useItemState from '../../hooks/useItemState'

const ItemOnBelt = ({ id }) => {
  // Get the type and emoji for the item using the useItemState hook
  const { type, emoji } = useItemState(id)

  // Return JSX to render the component
  return (
    <div
      title={type}
      className="w-max h-max -translate-x-1/2 -translate-y-1/2 text-[1.5rem]"
      style={{
        filter: 'drop-shadow(0px 0px 2px black) drop-shadow(0px 0px 2px black)',
      }}>
      {emoji}
    </div>
  )
}

export default ItemOnBelt
