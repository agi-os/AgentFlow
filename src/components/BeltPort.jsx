import { Position, Handle } from '@xyflow/react'

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
  const color = type === 'source' ? 'bg-lime-800' : 'bg-zinc-700'

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
