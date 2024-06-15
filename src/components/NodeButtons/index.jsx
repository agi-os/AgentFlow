import { useCallback, useState } from 'react'
import { useReactFlow, useStore } from '@xyflow/react'

// Import classNames
import classNames from './classNames'

// Define button data
const buttons = [
  { label: '✏️ Entry', type: 'entry' },
  { label: '🔀 Splitter', type: 'splitter' },
  { label: '🗄️ Item Chest', type: 'itemChest' },
  { label: '🛰️ Web Agent', type: 'webAgent' },
  { label: '🌠 Site Whisperer', type: 'siteWhisperer' },
  { label: '🧑‍💼 Agent', type: 'agent' },
  { label: '🧑‍💼 Crafting Agent', type: 'craftingAgent' },
  { label: '🛠️ Tool Chest', type: 'tool' },
  { label: '🧬 Schema', type: 'schema' },
  { label: '🔗 InPortal', type: 'inputPortal' },
  { label: '🔗 OutPortal', type: 'outputPortal' },
  // { label: '🗄️ Database', type: 'database' },
]

/**
 * Renders a group of buttons for adding nodes of different types.
 *
 * @component
 * @returns {JSX.Element} A div element containing the buttons.
 */
const NodeButtons = () => {
  const generateId = useStore(s => s.generateId)
  const [isCollapsed, setIsCollapsed] = useState(true)
  const reactFlowInstance = useReactFlow()

  /**
   * Handles the click event for a button.
   * Adds a new node of the specified type to the React Flow instance.
   *
   * @param {string} type - The type of node to be added.
   */
  const onClick = useCallback(
    type => {
      const id = generateId()
      const newNode = {
        id,
        position: {
          x: Math.random() * 500,
          y: Math.random() * 500,
        },
        type,
        data: {},
      }
      reactFlowInstance.addNodes(newNode)
    },
    [generateId, reactFlowInstance]
  )

  return (
    <div className="flex flex-wrap gap-5 relative">
      <div className="absolute bg-zinc-800 rounded-xl blur-md inset-1 pointer-events-none" />
      <button
        className={classNames.join(' ')}
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{ zIndex: 1 }} // Ensure button is on top
      >
        {isCollapsed ? '>' : '<'}
      </button>
      {!isCollapsed &&
        buttons.map(button => (
          <button
            key={button.label}
            className={classNames.join(' ')}
            onClick={() => onClick(button.type)}
            style={{ zIndex: 1 }} // Ensure button is on top
          >
            {button.label}
          </button>
        ))}
    </div>
  )
}

export default NodeButtons
