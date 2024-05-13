import { useState } from 'react'

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

/**
 * Renders a simple red-yellow-green semaphore with clickable toggles.
 * @returns {JSX.Element} The rendered semaphore.
 */
const Semaphore = () => {
  // Define the colors
  const colors = ['red', 'yellow', 'green']

  // Define the color state
  const [color, setColor] = useState(2)

  // Define the color classes
  const colorClasses = ['bg-red-500', 'bg-yellow-500', 'bg-green-500']

  // Combine all classes into a single string
  const allClasses = [...classNames, colorClasses[color]].join(' ')

  // Toggle the color on click
  const toggleColor = () => setColor((color + 1) % colors.length)

  // Render the semaphore
  return (
    <div
      title="Click to toggle the semaphore state"
      className={allClasses}
      onClick={toggleColor}
    />
  )
}

export default Semaphore
