// import { useNodeId, useStore } from '@xyflow/react'
// import { GRID_CONFIGS } from '../../components/RecipeInput/constants'
import Title from '../../components/Title'
const Header = () => {
  // const nodeId = useNodeId()
  // const updateNodeData = useStore(s => s.updateNodeData)
  // const gridConfig = useStore(
  //   state => state.nodes.find(n => n.id === nodeId)?.data?.gridConfig,
  //   (prevGridConfig, nextGridConfig) => prevGridConfig === nextGridConfig
  // )

  return (
    <Title>🧙‍♂️ Crafting Agent</Title>
    /* <div className="flex justify-evenly">
        {Object.keys(GRID_CONFIGS).map(gridKey => (
          <button
            key={gridKey}
            onClick={() => updateNodeData(nodeId, { gridConfig: gridKey })}>
            {gridKey}
          </button>
        ))}
      </div> */
  )
}

export default Header
