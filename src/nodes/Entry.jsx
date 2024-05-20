import { useCallback, useState } from 'react'
import { useReactFlow, useStore } from '@xyflow/react'
import Title from '../components/Title'
import baseClassNames from './classNames'
import Semaphore from '../components/Semaphore'
import Item from '../components/Item'

import { BeltSource } from '../components/BeltPort'
import Countdown from './ItemChest/Countdown'
import getRandomData from './getRandomData'

const EntryNode = ({ id, data, selected }) => {
  // Prepare the class names based on the selected state
  const selectedClassNames = selected
    ? ['outline-offset-8', 'outline-2']
    : ['outline-offset-0', 'outline-0']

  // Get the setItem function from the store
  const setItem = useStore(state => state.setItem)

  // Get the getLocationItems function from the store
  const locationItems = useStore(state => state.getLocationItems(id))

  const { updateNodeData } = useReactFlow()

  const [keys, setKeys] = useState(() => getRandomData())

  const addKey = () => {
    setKeys([...keys, { key: '', value: '' }])
  }

  const updateKey = (index, key, value) => {
    const newKeys = [...keys]
    newKeys[index] = { key, value }
    setKeys(newKeys)
    updateNodeData(id, { output: newKeys })
  }

  const deleteKey = index => {
    const newKeys = [...keys]
    newKeys.splice(index, 1)
    setKeys(newKeys)
    updateNodeData(id, { output: newKeys })
  }

  const createNewItem = useCallback(() => {
    setKeys(prevKeys => {
      const item = prevKeys.reduce((acc, { key, value }) => {
        // Skip empty keys
        if (value === '') return acc

        // Assign the value to the key
        acc[key] = value

        // Return the accumulator
        return acc
      }, {})

      // Assign the item's location to this node
      item.location = { id, distance: 0 }

      // Emit the item
      setItem(item)

      // Update the form with new random data
      const newKeys = getRandomData(prevKeys[0]?.value)
      return newKeys
    })
  }, [id, setItem])

  const classNames = [...baseClassNames, ...selectedClassNames, 'max-w-xl']

  // Get the id of the outbox edge
  const outboxEdgeId = useStore(
    store =>
      store.getNodeEdges('lcc-r8a').find(edge => edge.sourceHandle === 'outbox')
        ?.id
  )

  // Get reference to the store function setItemLocation
  const setItemLocation = useStore(state => state.setItemLocation)

  return (
    <div x-id={id} className={classNames.join(' ')}>
      <Title id={id}>✏️ Manual Entry</Title>
      <Semaphore />
      <div className="grid grid-cols-6 gap-4 p-2 pt-4">
        {keys &&
          keys?.map((keyObj, index) => [
            <Input
              key={index + 'key'}
              onChange={e => updateKey(index, e.target.value, keyObj.value)}
              text={keyObj.key || ''}
              className="col-span-2"
              disabled={keyObj.key === 'type' || keyObj.key === 'emoji'}
            />,
            <Input
              key={index + 'value'}
              onChange={e => updateKey(index, keyObj.key, e.target.value)}
              text={keyObj.value || ''}
              className="col-span-3"
            />,
            <div
              key={index + 'buttons'}
              className="col-span-1 align-middle flex items-center">
              {keyObj.key === 'type' ? (
                <button
                  key={index + 'delete'}
                  onClick={() => setKeys(getRandomData(keys[0]?.value))}
                  className={[
                    'p-2',
                    'rounded-full',
                    'bg-zinc-700',
                    'hover:bg-zinc-600',
                    'text-white',
                    'text-xs',
                    'nodrag',
                  ].join(' ')}>
                  🔮
                </button>
              ) : keyObj.key === 'emoji' ? (
                <button
                  key={index + 'delete'}
                  onClick={() => setKeys(getRandomData())}
                  className={[
                    'p-2',
                    'rounded-full',
                    'bg-zinc-700',
                    'hover:bg-zinc-600',
                    'text-white',
                    'text-xs',
                    'nodrag',
                  ].join(' ')}>
                  🧙‍♂️
                </button>
              ) : (
                <button
                  key={index + 'delete'}
                  onClick={() => deleteKey(index)}
                  className={[
                    'p-2',
                    'rounded-full',
                    'bg-red-900',
                    'hover:bg-red-800',
                    'text-white',
                    'text-xs',
                    'nodrag',
                  ].join(' ')}>
                  Delete
                </button>
              )}
            </div>,
          ])}
        <button
          onClick={addKey}
          className={[
            'transition-colors',
            'col-span-5',
            'p-2',
            'rounded-full',
            'bg-zinc-700',
            'hover:bg-zinc-600',
            'text-white',
            'text-xs',
            'nodrag',
          ].join(' ')}>
          Add more values
        </button>
        <button
          onClick={createNewItem}
          className={[
            'transition-colors',
            'col-span-4',
            'w-full',
            'p-2',
            'text-sm',
            'rounded-full',
            'bg-green-900',
            'hover:bg-green-800',
            'text-white',
            'nodrag',
          ].join(' ')}>
          Add the new {keys[0]?.value} {keys[1]?.value} to output
        </button>{' '}
        <button
          onClick={() => {
            for (let i = 0; i < 5; i++) {
              setKeys(getRandomData(keys[0]?.value))
              createNewItem()
            }
          }}
          className={[
            'transition-colors',
            'col-span-2',
            'w-full',
            'p-2',
            'text-sm',
            'rounded-full',
            'bg-green-900',
            'hover:bg-green-800',
            'text-white',
            'nodrag',
          ].join(' ')}>
          random {keys[0]?.value} {keys[1]?.value} × 10
        </button>
      </div>

      <div className="p-2">
        📍 {locationItems.length} items waiting at this location
      </div>

      {locationItems.length > 0 && (
        <div className="flex flex-wrap justify-evenly w-full gap-3 px-2 py-3">
          {locationItems.map(item => (
            <div
              key={item.id}
              onClick={() => {
                const itemId = item.id
                const locationId = outboxEdgeId
                setItemLocation({ itemId, locationId })
              }}
              className="cursor-pointer">
              <Item itemId={item.id} />
            </div>
          ))}
        </div>
      )}

      {data?.semaphore !== 'red' && <Countdown />}
      <BeltSource />
    </div>
  )
}

const Input = ({ onChange, text, className, disabled = false }) => (
  <input
    onChange={onChange}
    value={text}
    className={classNames.concat(className).join(' ')}
    disabled={disabled}
  />
)

export default EntryNode

const classNames = [
  'text-white',
  'w-full',
  'min-w-32',
  'p-2',
  'pl-3',
  'border',
  'border-zinc-700',
  'focus:border-zinc-500',
  'focus:bg-black',
  'focus:outline-none',
  'bg-zinc-900',
  'rounded-full',
  'nodrag',
]
