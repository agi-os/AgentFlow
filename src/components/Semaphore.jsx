import { useState } from 'react'
import { useReactFlow, useNodeId, useKeyPress } from '@xyflow/react'

/**
 * Renders a simple red-yellow-green semaphore with clickable toggles.
 * @param {Object} props - The component props.
 * @param {string} props.initial - The initial color of the semaphore.
 * @returns {JSX.Element} The rendered semaphore.
 */
const Semaphore = ({ initial }) => {
  // Get a handle on the react flow instance
  const reactFlow = useReactFlow()

  const qPressed = useKeyPress('q')

  // Get the id of the node
  const id = useNodeId()

  // Define the colors
  const colors = ['red', 'yellow', 'green', 'blue']

  // Get the initial color state if provided
  const initialColor = colors.indexOf(initial)

  // Define the color state
  const [color, setColor] = useState(initialColor >= 0 ? initialColor : 3)

  // Define the color classes
  const colorClasses = [
    'bg-red-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-600 opacity-50',
  ]

  // Combine all classes into a single string
  const allClasses = [...classNames, colorClasses[color]].join(' ')

  // Toggle the color on click
  const toggleColor = () => {
    setColor((color + 1) % colors.length)

    // Get the node from the store.
    const node = reactFlow.getNode(id)

    // Update the node with the new color.
    const newNode = {
      ...node,
      data: {
        ...node.data,
        semaphore: colors[(color + 1) % colors.length],
      },
    }

    // Update the node in the store.
    reactFlow.setNodes([
      ...reactFlow.getNodes().filter(n => n.id !== id),
      newNode,
    ])
  }

  // Render the semaphore
  return (
    <div
      x-id={id}
      title="Click to toggle the semaphore state"
      className={allClasses}
      onClick={toggleColor}>
      {qPressed && <p>Q pressed!</p>}
    </div>
  )
}

const classNames = [
  'absolute',
  'right-2',
  'top-2',
  'w-3',
  'h-3',
  'rounded-full',
  'cursor-pointer',
  'transition',
  'hover:scale-125',
]

export default Semaphore
