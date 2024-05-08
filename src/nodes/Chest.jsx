import { useCallback, useEffect } from 'react'
import {
  Position,
  Handle,
  useReactFlow,
  useHandleConnections,
  useNodesData,
} from '@xyflow/react'
import Input from '../components/Input'
import classNames from '../constants/classNames'
import Title from '../components/Title'
import Pre from '../components/Pre'

import colorMap from '../constants/colorMap'

import SignalHandles from '../signals/handle'
import { Fragment } from 'react'

/**
 * Chest is a storage node. Purpose is to store items that can be retrieved later.
 * @param {string} id - Node ID
 * @param {object} data - Node data
 * @returns {JSX.Element}
 */
const ChestNode = ({ id, data }) => {
  // Generate buckets of items by type
  const typedItems = data?.items?.reduce((acc, item) => {
    const type = item.type
    acc[type] = acc[type] || []
    acc[type].push(item)
    return acc
  }, {})

  return (
    <div className={classNames.join(' ')}>
      <SignalHandles />
      {/* <SourceSignalHandles /> */}
      <Handle id="inbox" type="target" position={Position.Top} />
      <Title id={id}>🗄️ Chest</Title>
      <div className={outerDivClassNames}>
        {data?.items &&
          Object.entries(typedItems).map(([type, items]) => (
            <div key={type} className={innerDivClassNames}>
              <div className={typeClassNames}>
                {type} ({items.length})
              </div>
              <div className="grid grid-cols-2 gap-2">
                {items.map(item => (
                  <div className={itemClassNames} key={item.id}>
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
      <Handle
        id="outbox"
        className="w-4 h-4 bg-lime-700 rounded-full"
        type="source"
        position={Position.Bottom}
      />
      {/* <Pre>{data}</Pre> */}
    </div>
  )
}

const outerDivClassNames = [
  'grid',
  'grid-cols-3',
  'gap-1',
  'p-1',
  'rounded',
  'bg-zinc-700',
].join(' ')

const innerDivClassNames = [
  'grid',
  'w-52',
  'bg-zinc-800',
  'rounded',
  'gap-2',
  'p-1',
].join(' ')

const typeClassNames = [
  'px-2',
  'py-1',
  'rounded',
  'bg-zinc-700',
  'text-white',
  'font-bold',
  'h-6',
].join(' ')

const itemClassNames = ['p-2', 'rounded', 'border', 'border-zinc-700'].join(' ')

export default ChestNode
