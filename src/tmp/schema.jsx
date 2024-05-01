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
      values: ['Web search', 'Scrape url', 'Scrape email', 'Video transcript'],
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

import { useContext } from 'react'
import { SocketContext } from '../Socket'

const classNames = [
  'bg-gray-900',
  'hover:bg-gray-800',
  'text-gray-400',
  'font-semibold',
  'py-2',
  'px-4',
  'border',
  'border-gray-400',
  'rounded',
  'shadow',
]

/**
 * Component generates a button which will emit the schema on ws provided by hook from socket context
 */
const SchemaButton = () => {
  const socket = useContext(SocketContext)
  return (
    <>
      <button
        className={classNames.join(' ')}
        onClick={() => socket.emit('schema', JSON.stringify(schema))}>
        Send schema
      </button>
      <button
        className={classNames.join(' ')}
        onClick={() => socket.emit('schema', JSON.stringify(searchSchema))}>
        Send search schema
      </button>
      <button
        className={classNames.join(' ')}
        onClick={() =>
          socket.emit('schema', JSON.stringify(multiSearchSchema))
        }>
        Send multi search schema
      </button>
      <button
        className={classNames.join(' ')}
        onClick={() => socket.emit('schema', JSON.stringify(toolkitSchema))}>
        Send toolkit schema
      </button>
      <button
        className={classNames.join(' ')}
        onClick={() =>
          socket.emit('schema', JSON.stringify(multiToolkitSchema))
        }>
        Send multi toolkit schema
      </button>
    </>
  )
}

export default SchemaButton
