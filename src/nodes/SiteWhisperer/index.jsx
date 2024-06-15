import Title from '../../components/Title'
import { Belts } from '../../components/BeltPort'
import SignalHandles from '../../signals/SignalHandles'
import { nodeClassNames } from './constants'
import Inputs from '../../components/Inputs'
import { inputs } from './config'
import { useReactFlow, useStore } from '@xyflow/react'
import useSelectedClassNames from '../../hooks/useSelectedClassNames'
import { useCallback, useState } from 'react'
import StartSearchButton from './StartSearchButton'
import Outbox from './Outbox'
import { Spinner } from './Spinner'

const WebAgent = ({ id, data }) => {
  const { updateNodeData } = useReactFlow()

  // Save state of execution for the start button state
  const [isExecuting, setIsExecuting] = useState(false)

  // Get a handle to socket from the store
  const socket = useStore(state => state.socket)

  // Get a handle to setItem on the store
  const setItem = useStore(state => state.setItem)

  // Prepare the class names based on the selected state
  const selectedClassNames = useSelectedClassNames()

  const classNames = [...nodeClassNames, ...selectedClassNames]

  // Trigger the backend call
  const onClick = useCallback(async () => {
    // Set the execution state to true
    setIsExecuting(true)

    // Get the params from data
    const { query, domain, placeholder, value } = data

    // Emit web browser call to the backend
    socket.emit(
      'webZombie',
      { query, domain, placeholder, value },
      response => {
        try {
          console.log('LLM Response:', response)

          // Loop over all items in the response array
          response.forEach(({ title, href }) => {
            // Create a new item from the response
            const newItem = {
              type: data.outputType || 'llmResponse',
              emoji: data.outputEmoji || '💬',
              title,
              href,
              location: {
                id,
                distance: 0,
              },
            }

            // Add the new item to the store
            setItem(newItem)
          })
        } catch (error) {
          console.error('Error processing LLM response:', error)
        } finally {
          // Set the execution state to false
          setIsExecuting(false)
        }
      }
    )
  }, [data, id, setItem, socket])

  const onChange = useCallback(
    ({ value, field }) => {
      updateNodeData(id, { [field]: value })
    },
    [id, updateNodeData]
  )

  return (
    <div x-node-id={id} className={classNames.join(' ')}>
      <Title description="Upgrades the site behavior to produce more optimal output, then uses the upgraded web site like a regular human would.">
        🌠 Site Whisperer
      </Title>
      <Inputs
        classNames={['grid', 'grid-cols-12', 'gap-x-4', 'gap-y-3', 'p-3']}
        inputs={inputs}
        data={data}
        onChange={onChange}
      />
      {isExecuting ? (
        <div className="p-4 flex flex-row gap-5">
          <Spinner />
          Working...
        </div>
      ) : (
        <StartSearchButton onClick={onClick} />
      )}
      <Outbox />
      <Belts />
      <SignalHandles />
    </div>
  )
}

export default WebAgent
