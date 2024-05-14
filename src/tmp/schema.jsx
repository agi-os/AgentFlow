const schema = {
  age: {
    type: 'number',
    constraints: {
      min: 0,
      max: 120,
    },
    description: 'The age of the user',
  },
  firstName: {
    type: 'string',
    description:
      'The first name of the user, lowercase with capital first letter',
  },
  surname: {
    type: 'string',
    description: 'The surname of the user, lowercase with capital first letter',
  },
  sex: {
    type: 'enum',
    constraints: {
      values: ['M', 'F'],
    },
    description: 'The sex of the user, guess if not provided',
  },
}

const searchSchema = {
  purpose: {
    type: 'string',
    description: 'Reason for executing the search',
  },
  query: {
    type: 'string',
    description: 'Search query to be executed',
  },
  type: {
    type: 'enum',
    constraints: {
      values: ['VIDEO', 'EMAIL'],
    },
    description: 'Type of search to be executed',
  },
}

const multiSearchSchema = {
  searches: {
    type: 'array',
    items: searchSchema,
    description: 'Array of searches to be executed',
  },
}

const toolkitSchema = {
  purpose: {
    type: 'string',
    description: 'Reason for using the chosen tool',
  },
  tool: {
    type: 'enum',
    constraints: {
      values: ['webSearch', 'webScrape', 'reflection', 'planning'],
    },
    description: 'The tool to be used',
  },
  args: {
    type: 'string',
    description: 'Argument to be passed to the tool',
  },
}

const multiToolkitSchema = {
  actions: {
    type: 'array',
    items: toolkitSchema,
    description: 'Array of actions to be executed',
  },
}

import { useContext, useCallback } from 'react'
import { SocketContext } from '../Socket'
import { useReactFlow } from '@xyflow/react'

export const classNames = [
  'bg-zinc-900',
  'hover:bg-zinc-800',
  'text-zinc-400',
  'hover:text-zinc-200',
  'font-semibold',
  'py-2',
  'px-4',
  'border',
  'border-zinc-700',
  'rounded-full',
  'shadow-lg',
  'outline',
  'outline-opacity-50',
  'outline-black',
  'outline-4',
]

let nodeId = 10
const buttonsOld = [
  { schema: {}, label: '🗒️ Notepad', secondParam: 'notepad' },
  { schema: {}, label: '🗃️ Archive', secondParam: 'archive' },
  { schema: searchSchema, label: '🧬 Search schema' },
  { schema: multiSearchSchema, label: 'Multi search schema' },
  { schema: toolkitSchema, label: 'Toolkit schema' },
  { schema: multiToolkitSchema, label: 'Multi toolkit schema' },
  { schema: {}, label: ' Emit', secondParam: 'emit' },
  { schema: {}, label: 'Actions', secondParam: 'actions' },
]

const buttons = [
  { schema: {}, label: '🗄️ Item Chest', secondParam: 'itemChest' },
  { schema: {}, label: '🗄️ Chest', secondParam: 'chest' },
  {
    schema: {},
    label: '🔢 Constant Combinator',
    secondParam: 'constantCombinator',
  },
  { schema: schema, label: '🧬 Schema' },
  { schema: {}, label: '✏️ Entry', secondParam: 'entry' },
  { schema: {}, label: '🧑‍💼 Agent', secondParam: 'agent' },
  { schema: {}, label: '🛠️ Tool', secondParam: 'tool' },
  { schema: {}, label: '🏗️ Workbench', secondParam: 'workbench' },
  { schema: {}, label: '🐣 Action', secondParam: 'action' },
  { schema: {}, label: '🛎️ Result', secondParam: 'result' },
]

/**
 * Component generates button which will emit the schema on ws provided by hook from socket context
 */
import { useState } from 'react'

const SchemaButton = ({ old = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const socket = useContext(SocketContext)
  const reactFlowInstance = useReactFlow()

  const onClick = useCallback(
    (schema, type = 'schema') => {
      const id = `${type}-${++nodeId}`
      const newNode = {
        id,
        position: {
          x: Math.random() * 500,
          y: Math.random() * 500,
        },
        type,
        data: {
          label: `Node ${id}`,
        },
      }
      reactFlowInstance.addNodes(newNode)

      if (Object.keys(schema).length !== 0) {
        socket.emit('schema', JSON.stringify(schema))
      }
    },
    [socket, reactFlowInstance]
  )

  return (
    <div className="flex flex-wrap gap-5">
      <button
        className={classNames.join(' ')}
        onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? '>' : '<'}
      </button>
      {!isCollapsed &&
        (old ? buttonsOld : buttons).map((button, index) => (
          <button
            key={index}
            className={classNames.join(' ')}
            onClick={() => onClick(button.schema, button.secondParam)}>
            {button.label}
          </button>
        ))}
    </div>
  )
}

export default SchemaButton
