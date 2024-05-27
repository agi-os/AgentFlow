import AddItemButton from './AddItemButton'

/**
 * Renders an empty chest component.
 * @returns {JSX.Element} The empty chest component.
 */
const EmptyChest = ({ dimensions }) => {
  // Get dimensions provided by the parent zoom responsive wrapper
  const { width, height } = dimensions

  // If size is too small, do not render the empty chest component
  if (width < 150 || height < 150) {
    return null
  }

  // Render the empty chest component
  return (
    <div className="flex flex-col items-center justify-evenly pb-[15%] h-full w-full">
      <div className="text-4xl mb-12">?📦</div>
      <div>This chest is empty</div>
      <AddItemButton />
    </div>
  )
}

export default EmptyChest
