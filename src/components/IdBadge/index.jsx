import { useStore } from '@xyflow/react'
import baseClassNames from './classNames'

/**
 * Renders an ID badge component responsive to the zoom level.
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content to be rendered inside the badge.
 * @returns {JSX.Element} The rendered ID badge component.
 */
const IdBadge = ({ id, children, outline = true }) => {
  // Get the zoom level from the store
  const zoomLevel = useStore(s => s.transform[2])

  // Calculate opacity based on zoom level
  let opacity = 0
  if (zoomLevel >= 1.5 && zoomLevel <= 4) {
    opacity = (zoomLevel - 1.5) / (4 - 1.5)
  } else if (zoomLevel > 4) {
    opacity = 1
  }

  // If user is taking a closer look, make the badge more prominent
  const zoomClassNames =
    zoomLevel > 5
      ? [
          'text-zinc-400',
          'font-medium',
          'bg-zinc-900',
          'pl-[0.05rem]',
          'ml-[-0.05rem]',
          outline
            ? 'outline-zinc-900'
            : 'left-3 top-8 outline-none border-none',
        ]
      : [
          'text-zinc-600',
          outline
            ? 'outline-zinc-800'
            : 'left-3 top-8 outline-none border-none',
        ]

  // Combine the base and zoom class names
  const classNames = [...baseClassNames, ...zoomClassNames]

  // Render the badge
  return (
    <div x-node-id={id} style={{ opacity }} className={classNames.join(' ')}>
      {children}
    </div>
  )
}

export default IdBadge
