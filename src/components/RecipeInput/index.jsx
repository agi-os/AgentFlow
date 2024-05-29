import { useEffect, useState } from 'react'
import { useStore, useNodeId } from '@xyflow/react'
import OutputSlots from './OutputSlots'
import InboxSlots from './InboxSlots'
import CraftingSlots from './CraftingSlots'
import { GRID_CONFIGS, recipeInputClassNames } from './constants'
import { splitGrid } from './utils'
import Title from './Title'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Line from './Line'

/**
 * RecipeInput component renders a crafting interface for crafting items from inventory.
 * It manages the crafting grid, selected items, crafting process, and output slots.
 *
 * @returns {JSX.Element} React component for crafting interface
 */
const RecipeInput = () => {
  const nodeId = useNodeId()
  const socket = useStore(s => s.socket)
  const items = useStore(
    s => s.getLocationItems(nodeId),
    (oldItems, newItems) => oldItems.length === newItems.length
  )

  const gridConfig = '3x3' // useStore(  TODO: debug in parent
  //   state => state.nodes.find(n => n.id === nodeId)?.data?.gridConfig,
  //   (prevGridConfig, nextGridConfig) => prevGridConfig === nextGridConfig
  // )

  const { rows, cols, size } = GRID_CONFIGS[gridConfig]

  const [craftingGrid, setCraftingGrid] = useState(null)

  const [craftingMatrix, setCraftingMatrix] = useState(null)

  useEffect(() => {
    // Initialize grid if not defined
    if (craftingGrid === null) {
      console.log('grid reset', { craftingGrid, size, nodeId })
      setCraftingGrid(Array(size).fill(null))
    }
  }, [craftingGrid, nodeId, setCraftingGrid, size])

  useEffect(() => {
    console.log(craftingGrid)

    if (!craftingGrid || !items) return

    let availableItems = [...items]

    // Replace each cell with an item of the same type from availableItems
    const itemGrid = craftingGrid.map(cell => {
      if (cell === null) {
        return null
      }
      const index = availableItems.findIndex(item => item.type === cell.type)
      if (index !== -1) {
        const itemCopy = JSON.parse(
          JSON.stringify(availableItems.splice(index, 1)[0])
        )
        delete itemCopy.id
        delete itemCopy.location
        return itemCopy
      }
      return null
    })

    // Update the crafting grid state with the new grid of items
    // setCraftingGrid(itemGrid);

    // Optionally, create a matrix of items if needed elsewhere
    const matrix = splitGrid(itemGrid, 3)
    console.log(matrix)

    setCraftingMatrix(matrix)
  }, [craftingGrid, items])

  const [inboxSlots, setInboxSlots] = useState([])

  const [selectedInboxItem, setSelectedInboxItem] = useState(null)

  const [outputSlots, setOutputSlots] = useState([])

  const [recipe, setRecipe] = useState({})

  const [crafting, setCrafting] = useState(false)

  const putOnBelt = useStore(s => s.putOnBelt)
  const setItem = useStore(s => s.setItem)
  const getNodeEdges = useStore(s => s.getNodeEdges)

  // Do not render if grid is not yet initialized
  if (!craftingGrid) return null

  // Render the component
  return (
    <div x-node-id={nodeId} className={recipeInputClassNames.join(' ')}>
      <Title>Inventory</Title>
      <InboxSlots
        slots={inboxSlots}
        setSlots={setInboxSlots}
        onClick={setSelectedInboxItem}
      />
      <Line />
      <Title>Crafting from</Title>

      <CraftingSlots
        rows={rows}
        cols={cols}
        craftingGrid={craftingGrid}
        setCraftingGrid={setCraftingGrid}
        selectedInboxItem={selectedInboxItem}
      />
      {craftingGrid.filter(Boolean).length === 0 ? (
        <div className="text-center text-balance pt-4">
          👆 Arrange some items to craft with
        </div>
      ) : (
        <>
          <button
            className="border border-zinc-700 rounded-full py-2 w-full my-5 text-sm"
            onClick={() => {
              // Do not trigger multiple times
              if (crafting) return

              setCrafting(true)

              // Send request to server
              socket.emit(
                'llmSchema',
                {
                  preset: 'minecrafting',
                  content: craftingMatrix,
                },
                response => {
                  setOutputSlots([
                    response.item1,
                    response.item2,
                    response.item3,
                  ])

                  setCrafting(false)
                }
              )
            }}>
            {crafting ? 'Searching...' : 'Imagine what could be 🪄'}
          </button>
          {outputSlots.length === 0 ? (
            <div className="text-center text-balance">
              👆 Detect some recipes you can craft.
            </div>
          ) : (
            <>
              <Title>Recipes detected</Title>
              <OutputSlots
                slots={outputSlots}
                setSlots={setOutputSlots}
                setRecipe={setRecipe}
              />
              <div className="text-xs italic text-center p-2">
                <Markdown remarkPlugins={[remarkGfm]}>
                  {recipe.markdown}
                </Markdown>
              </div>

              <button
                className="border border-zinc-700 rounded-full py-2 w-full my-5 text-sm"
                onClick={() => {
                  console.log(recipe)

                  const outboxEdge = getNodeEdges(nodeId).find(
                    edge =>
                      edge.source === nodeId && edge.sourceHandle === 'outbox'
                  )

                  if (outboxEdge) {
                    // Create the new item
                    const newItem = setItem({
                      ...recipe,
                      location: { id: outboxEdge.id, distance: 0 },
                    })

                    // Put the item on the belt
                    putOnBelt({ itemId: newItem.id, beltId: outboxEdge.id })
                  }
                }}>
                Craft the {recipe.emoji} recipe
              </button>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default RecipeInput
