import { useStore, useReactFlow, useNodeId, useKeyPress } from '@xyflow/react'
import signalTypes from '../constants/signalTypes'
import { useCallback } from 'react'

/**
 * Renders a simple red-yellow-green semaphore with clickable toggles.
 * @param {Object} props - The component props.
 * @param {string} props.initial - The initial color of the semaphore.
 * @param {string[]} props.colors - The colors of the semaphore.
 * @param {string[]} props.classNames - The class names of the semaphore.
 * @returns {JSX.Element} The rendered semaphore.
 */
const Semaphore = ({
  initial = 'blue',
  colors = ['red', 'yellow', 'green', 'blue'],
  classNames = [
    'absolute',
    'right-2',
    'top-2',
    'w-3',
    'h-3',
    'rounded-full',
    'cursor-pointer',
    'transition',
    'hover:scale-125',
  ],
}) => {
  // Get a handle on the react flow instance
  const reactFlow = useReactFlow()
  const signalHubEmit = useStore(s => s.signalHubEmit)

  const qPressed = useKeyPress('q')

  // Get the id of the node
  const id = useNodeId()

  // Get the current color on the node
  const color = useStore(store => store.getNode(id)?.data?.semaphore) || initial

  // Define the color classes
  const colorClasses = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    blue: 'bg-blue-600 opacity-50',
  }

  // Combine all classes into a single string
  const allClasses = [...classNames, colorClasses[color]].join(' ')

  // Toggle the color on click
  const toggleColor = useCallback(() => {
    // Get the index of the current color
    const colorIndex = colors.indexOf(color)

    // Get the next color in the list
    const nextColor = colors[(colorIndex + 1) % colors.length]

    // Get all the nodes
    const nodes = reactFlow.getNodes()

    // Update this node with the new color.
    const updatedNodes = nodes.map(node => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            semaphore: nextColor,
          },
        }
      }

      // Return other nodes unchanged.
      return node
    })

    // Update the node in the store.
    reactFlow.setNodes(updatedNodes)

    // Emit the SEMAPHORE_CHANGE signal
    signalHubEmit(id, signalTypes.SEMAPHORE_CHANGE, { color: nextColor })
  }, [color, colors, id, reactFlow, signalHubEmit])

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

export default Semaphore
