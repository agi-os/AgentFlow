import { Position, Handle, useReactFlow, useNodeId } from '@xyflow/react'
import { validateDataPacket } from '../utils/validation'
import { useStore } from '@xyflow/react'

/**
 * Renders a belt port for a source or target signal.
 * @param {object} props - The component props.
 * @returns {JSX.Element} - The rendered belt.
 */
export const Belt = props => {
  const { type, id: providedId, data: providedData } = props

  // Get the functions from the store
  const putOnBelt = useStore(s => s.putOnBelt)
  const getNodeEdges = useStore(s => s.getNodeEdges)

  // If the id is not provided, default to 'outbox' for sources and 'inbox' for targets.
  const id = providedId ? providedId : type === 'source' ? 'outbox' : 'inbox'

  // Set the color based on the type.
  let color = type === 'source' ? 'bg-lime-900' : 'bg-zinc-700'

  // Get a handle to react flow.
  const reactFlow = useReactFlow()

  // Get the node id from the store.
  const nodeId = useNodeId()

  const nodeItems = useStore(state => state.getLocationItems(nodeId))

  // If the nodeId is available, adjust the color based on the node's semaphore.
  if (nodeId) {
    const node = reactFlow.getNode(nodeId)
    const data = node?.data || {}

    switch (data?.semaphore) {
      case 'red':
        color = 'bg-red-500 animate-pulse'
        break
      case 'yellow':
        color = 'bg-yellow-500 animate-pulse'
        break
      case 'green':
        color = 'bg-green-500'
        break
    }
  }

  // Set the position based on the type.
  const position = type === 'source' ? Position.Bottom : Position.Top

  // Set the class names based on the type and color.
  const classNames = ['w-16', 'rounded-full', color]

  // If this is a source belt, handle data emission
  const handleEmitData = () => {
    console.log('handle emit')
    // If no data is provided, abort
    if (!providedData) return

    // Validate the data packet against the schema
    if (!validateDataPacket(providedData)) {
      console.error('Invalid data packet:', providedData)
      return
    }

    // Find the edge connected to this belt port
    const edgeId = getNodeEdges(nodeId).find(
      edge => edge.source === nodeId && edge.sourceHandle === id
    )?.id

    // If no connected edge is found, log an error and abort
    if (!edgeId) {
      console.error(
        `No connected edge found for node ${nodeId} and handle ${id}`
      )
      return
    }

    // Put the validated data packet on the belt
    putOnBelt({ itemId: providedData.id, beltId: edgeId })
  }

  // Extract the onReceive from props, so Handle doesn't complain
  const { onReceive, ...rest } = props

  // Return the rendered belt handle.
  return (
    <>
      <Handle
        id={id}
        className={classNames.join(' ')}
        type={type}
        position={position}
        {...rest}
      />
      {type === 'source' && nodeItems.length > 0 && (
        <ReleaseButton onReceive={onReceive} onClick={handleEmitData} />
      )}
    </>
  )
}
const ReleaseButton = ({
  onClick,
  classNames = [
    'absolute',
    '-bottom-12',
    '-translate-x-1/2',
    'left-1/2',
    'cursor-pointer',
    'grid',
    'w-20',
    'h-20',
    'rounded-full',
    'opacity-25',
    'hover:opacity-100',
    'place-content-center',
  ],
}) => {
  // Render the release button
  return (
    <div
      onClick={onClick}
      className={classNames.join(' ')}
      title="release one item">
      🔻
    </div>
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

/**
 * Renders both the target and source belts.
 * @param {object} props - The component props shared by both belts.
 * @returns {JSX.Element} - The rendered target and source belts.
 */
export const Belts = props => (
  <>
    <BeltTarget {...props} key="targetBelt" />
    <BeltSource {...props} key="sourceBelt" />
  </>
)
