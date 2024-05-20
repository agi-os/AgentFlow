import { useCallback, useState } from 'react'
import { useReactFlow, useStore } from '@xyflow/react'
import Title from '../components/Title'
import baseClassNames from './classNames'
import Semaphore from '../components/Semaphore'

const EntryNode = ({ id, selected }) => {
  // Prepare the class names based on the selected state
  const selectedClassNames = selected
    ? ['outline-offset-8', 'outline-2']
    : ['outline-offset-0', 'outline-0']

  // Get the setItem function from the store
  const setItem = useStore(state => state.setItem)

  // Get the getLocationItems function from the store
  const locationItems = useStore(state => state.getLocationItems(id))

  const { updateNodeData } = useReactFlow()

  const [keys, setKeys] = useState([
    { key: 'type', value: 'user' },
    { key: 'name', value: 'Joe' },
  ])

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
    const item = keys.reduce((acc, { key, value }) => {
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
  }, [id, keys, setItem])

  const classNames = [...baseClassNames, ...selectedClassNames]

  return (
    <div x-id={id} className={classNames.join(' ')}>
      <Title id={id}>✏️ Manual Entry</Title>
      <Semaphore />
      <div className="grid grid-cols-6 gap-4 p-2 pt-4">
        {keys.map((keyObj, index) => [
          <Input
            key={index + 'key'}
            onChange={e => updateKey(index, e.target.value, keyObj.value)}
            text={keyObj.key}
            className="col-span-2"
            disabled={index === 0 && keyObj.key === 'type'}
          />,
          <Input
            key={index + 'value'}
            onChange={e => updateKey(index, keyObj.key, e.target.value)}
            text={keyObj.value}
            className="col-span-3"
          />,
          <div
            key={index + 'buttons'}
            className="col-span-1 align-middle flex items-center">
            {index !== 0 && (
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
                Delete key
              </button>
            )}
          </div>,
        ])}

        <button
          onClick={addKey}
          className={[
            'col-span-5',
            'p-2',
            'rounded-full',
            'bg-zinc-700',
            'hover:bg-zinc-600',
            'text-white',
            'text-xs',
            'nodrag',
          ].join(' ')}>
          Add key
        </button>

        <button
          onClick={createNewItem}
          className={[
            'col-span-6',
            'w-full',
            'p-2',
            'text-sm',
            'rounded-full',
            'bg-green-900',
            'hover:bg-green-800',
            'text-white',
            'nodrag',
          ].join(' ')}>
          Create new item
        </button>
      </div>
      <div className="p-2">
        {locationItems.length > 0 && (
          <div>
            items ready to be released
            {locationItems.map((item, index) => (
              <div key={index} className="p-2">
                {index}: {JSON.stringify(item)}
              </div>
            ))}
          </div>
        )}
      </div>
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
