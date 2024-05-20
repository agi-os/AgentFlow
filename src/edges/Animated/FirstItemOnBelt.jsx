import beltItemClassNames from './beltItemClassNames'
import { useStore } from '@xyflow/react'

/**
 * Renders the first item on the belt.
 * @param {Object} props - The component props.
 * @param {Object} props.node - The node object.
 * @returns {JSX.Element} The rendered component.
 */
const FirstItemOnBelt = ({ edgeId }) => {
  // Get the store
  const store = useStore()

  // Get the item id from the edge's data
  const itemId = store.edges.find(e => e.id === edgeId)?.data?.items?.[0]

  // Get the item from the store
  const item = store.items.find(i => i.id === itemId)

  // Get the emoji from the item
  const emoji = item?.emoji

  // Render the first item on the belt
  return (
    <div x-id={itemId} className={beltItemClassNames.join(' ')}>
      {emoji}
    </div>
  )
}

export default FirstItemOnBelt
