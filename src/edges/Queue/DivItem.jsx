import InViewContent from './InViewContent'
import { useStore } from '@xyflow/react'

const DivItem = ({ item, transform }) => {
  // Get the current tick duration with added padding to prevent flickering
  const tickLength = useStore(s => s.tickLength) * 1.05

  // Render the item
  return (
    <div
      x-id={item.id}
      xmlns="http://www.w3.org/1999/xhtml"
      className={classNames.join(' ')}
      style={{
        transform,
        transition: `transform ${tickLength}ms linear, opacity ${tickLength}ms linear`,
      }}>
      <div x-id={item.id} className="relative -top-0.5">
        {item.emoticon}
      </div>
      <InViewContent item={item} />
    </div>
  )
}

const classNames = [
  'grid',
  'place-items-center',
  'w-10',
  'h-10',
  'relative',
  'rounded-full',
  'bg-zinc-900',
  'border',
  'border-zinc-900',
  'bg-opacity-85',
  '-top-5',
  '-left-5',
  'shadow-inner',
  'shadow-zinc-800',
  'select-none',
  'transform-gpu',
]

export default DivItem
