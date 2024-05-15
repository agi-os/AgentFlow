import { useStore } from '@xyflow/react'

/**
 * Renders an ID badge component responsive to the zoom level.
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content to be rendered inside the badge.
 * @returns {JSX.Element} The rendered ID badge component.
 */
const IdBadge = ({ children }) => {
  // Get the zoom level from the store
  const zoomLevel = useStore(s => s.transform[2])

  // If zoom level is less than 2.5, badge would be too small to read and just clutter the view
  const opacityClass = zoomLevel < 2.5 ? 'opacity-0' : 'opacity-100'

  // If user is taking a closer look, make the badge more prominent
  const zoomClassNames =
    zoomLevel > 5
      ? [
          'text-zinc-400',
          'font-medium',
          'bg-zinc-900',
          'pl-[0.05rem]',
          'ml-[-0.05rem]',
          'outline-zinc-900',
        ]
      : ['text-zinc-600', 'outline-zinc-800']

  // Combine the base and zoom class names
  const classNames = [...baseClassNames, ...zoomClassNames, opacityClass]

  // Render the badge
  return <div className={classNames.join(' ')}>{children}</div>
}

const baseClassNames = [
  'uppercase',
  'text-[0.15rem]',
  'tracking-[0.05rem]',
  'absolute',
  'top-1',
  'right-1.5',
  'font-mono',
  'leading-[initial]',
  'rounded-[0.05rem]',
  'transition-all',
  'duration-500',
  'outline',
  'outline-[0.1rem]',
]

export default IdBadge
