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

import { useContext } from 'react'
import { SocketContext } from '../Socket'

/**
 * Component generates a button which will emit the schema on ws provided by hook from socket context
 */
const SchemaButton = () => {
  const socket = useContext(SocketContext)
  return (
    <button
      className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
      onClick={() => socket.emit('schema', JSON.stringify(schema))}>
      Send schema
    </button>
  )
}

export default SchemaButton
