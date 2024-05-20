import { classNames } from './classNames'
import InViewContent from './InViewContent'
import { useStore } from '@xyflow/react'

const DivItem = ({ item, transform = '' }) => {
  // Get the current tick duration with added padding to prevent sharp direction changes
  const tickLength = useStore(s => s.tickLength) * 1.2

  // Opacity should be set to 1 only when item gets the transform property set
  const opacity = transform.length ? 1 : 0

  // Render the item
  return (
    <div
      x-id={item.id}
      xmlns="http://www.w3.org/1999/xhtml"
      className={classNames.join(' ')}
      style={{
        opacity,
        transform,
        transition: `transform ${tickLength}ms linear, opacity 500ms linear`,
      }}>
      <div x-id={item.id} className="relative -top-0.5">
        {item.emoji}
      </div>
      <InViewContent item={item} />
    </div>
  )
}

export default DivItem
