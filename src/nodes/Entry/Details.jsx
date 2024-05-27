import {
  deleteButtonClassNames,
  addButtonClassNames,
  createNewItemButtonClassNames,
  randomButtonClassNames,
  magicButtonClassNames,
  wizardButtonClassNames,
} from './constants'

import { useCallback, useState } from 'react'
import { useNodeId, useReactFlow, useStore } from '@xyflow/react'

import getRandomData from '../getRandomData'

import useClipboard from '../../hooks/useClipboard'
import Input from './Input'

const Details = () => {
  // Get the node id
  const id = useNodeId()

  // Get the setItem function from the store
  const setItem = useStore(state => state.setItem)

  // Get the getLocationItems function from the store
  const locationItems = useStore(state => state.getLocationItems(id))

  const { readFromClipboard } = useClipboard()

  const { updateNodeData } = useReactFlow()

  const [keys, setKeys] = useState(() => getRandomData())

  const pasteFromClipboard = async () => {
    try {
      const clipboardContent = await readFromClipboard()
      const item = JSON.parse(clipboardContent)

      // Assign the item's location to this node
      item.location = { id, distance: 0 }

      setItem(item)
    } catch (error) {
      console.error('Failed to paste item from clipboard:', error)
    }
  }

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

      // Update the form with new random data, fallback to copy of the same item
      const newKeys =
        getRandomData(prevKeys[0]?.value) || JSON.parse(JSON.stringify(item))
      return newKeys
    })
  }, [id, setItem])

  return (
    <>
      <div className="grid grid-cols-6 gap-4 p-2 pt-4">
        {keys &&
          keys.map((keyObj, index) => [
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
                  className={magicButtonClassNames.join(' ')}>
                  🔮
                </button>
              ) : keyObj.key === 'emoji' ? (
                <button
                  key={index + 'delete'}
                  onClick={() => setKeys(getRandomData())}
                  className={wizardButtonClassNames.join(' ')}>
                  🧙‍♂️
                </button>
              ) : (
                <button
                  key={index + 'delete'}
                  onClick={() => deleteKey(index)}
                  className={deleteButtonClassNames.join(' ')}>
                  Delete
                </button>
              )}
            </div>,
          ])}
        <button onClick={addKey} className={addButtonClassNames.join(' ')}>
          Add more values
        </button>
        <button
          onClick={createNewItem}
          className={createNewItemButtonClassNames.join(' ')}>
          Add the new {keys[0]?.value} {keys[1]?.value} to output
        </button>
        <button
          onClick={() => {
            for (let i = 0; i < 5; i++) {
              setKeys(getRandomData(keys[0]?.value))
              createNewItem()
            }
          }}
          className={randomButtonClassNames.join(' ')}>
          random {keys[0]?.value} {keys[1]?.value} × 10
        </button>
      </div>
      <div className="p-2 flex justify-between items-center">
        <div>📍 {locationItems.length} items waiting at this location</div>
        <button onClick={pasteFromClipboard}>📋 Paste from clipboard</button>
      </div>
    </>
  )
}

export default Details
