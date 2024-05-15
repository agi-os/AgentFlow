import { Position, Handle, useReactFlow, useNodeId } from '@xyflow/react'

/**
 * Renders the belt port for a source or target signal.
 * @param {object} props - The component props.
 * @returns {JSX.Element} - The rendered belt.
 */
export const Belt = props => {
  // Extract the type from the props.
  const { type } = props

  // If the id is not provided, default to 'outbox' for sources and 'inbox' for targets.
  const id = props?.id ? props.id : type === 'source' ? 'outbox' : 'inbox'

  // Set the color based on the type.
  let color = type === 'source' ? 'bg-lime-900' : 'bg-zinc-700'

  // Get a handle to react flow.
  const reactFlow = useReactFlow()

  // Get the node id from the store.
  const nodeId = useNodeId()

  if (nodeId) {
    // Get the node from the react flow instance.
    const node = reactFlow.getNode(nodeId)

    // Get the data from the node.
    const data = node?.data || {}

    // If the node data has a color, use it.
    switch (data?.semaphore) {
      case 'red':
        color = 'bg-red-500 animate-pulse'
        break
      case 'yellow':
        color = 'bg-yellow-500 animate-pulse'
        break
      case 'green':
        color = 'bg-green-500'
    }
  }

  // Set the position based on the type.
  const position = type === 'source' ? Position.Bottom : Position.Top

  // Set the class names based on the type and color.
  const classNames = ['w-16', 'rounded-full', color]

  // Return the rendered belt.
  return (
    <Handle
      id={id}
      className={classNames.join(' ')}
      type={type}
      position={position}
      {...props}
    />
  )
}

/**
 * Renders the belt for a target signal.
 * @param {object} props - The component props.
 * @returns {JSX.Element} - The rendered target belt.
 */
export const BeltTarget = props => <Belt type="target" {...props} />

/**
 * Renders the belt for a source signal.
 * @param {object} props - The component props.
 * @returns {JSX.Element} - The rendered source belt.
 */
export const BeltSource = props => <Belt type="source" {...props} />
