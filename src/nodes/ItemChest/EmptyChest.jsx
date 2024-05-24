import AddItemButton from './AddItemButton'

/**
 * Renders an empty chest component.
 * @returns {JSX.Element} The empty chest component.
 */
const EmptyChest = () => (
  <div className="flex flex-col items-center justify-evenly pb-[15%] h-full w-full">
    <div className="text-4xl mb-12">?📦</div>
    <div>This chest is empty</div>
    <AddItemButton />
  </div>
)

export default EmptyChest
