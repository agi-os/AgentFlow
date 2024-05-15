import AddItemButton from './AddItemButton'

/**
 * Renders an empty chest component.
 * @returns {JSX.Element} The empty chest component.
 */
const EmptyChest = () => (
  <div className="flex flex-col gap-16 items-center justify-center w-full h-full">
    <div>This chest is empty</div>
    <div className="text-3xl mb-12">📦</div>
    <AddItemButton />
  </div>
)

export default EmptyChest
