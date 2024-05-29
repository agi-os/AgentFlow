import { useNodeId } from '@xyflow/react'
import RecipeInput from '../../components/RecipeInput'

const Details = () => {
  const nodeId = useNodeId()

  return (
    <div x-node-id={nodeId}>
      <RecipeInput />
    </div>
  )
}

export default Details
