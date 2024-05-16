import { useContext, useCallback } from 'react'
import { SocketContext } from '../Socket'
import { useReactFlow, useStore } from '@xyflow/react'
import { useState } from 'react'
import { classNames } from './classNames'
import { buttonsOld, buttons } from './schema'

const SchemaButton = ({ old = false }) => {
  const generateId = useStore(s => s.generateId)
  const [isCollapsed, setIsCollapsed] = useState(true)
  const socket = useContext(SocketContext)
  const reactFlowInstance = useReactFlow()

  const onClick = useCallback(
    (schema, type = 'schema') => {
      const id = generateId()
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
