import React from 'react'
import { useStore } from '@xyflow/react'
import ItemDetails from './ItemDetails'

const Item = React.memo(({ onClick = () => {}, itemId }) => {
  const item = useStore(state => state.getItem(itemId))
  const removeItem = useStore(state => state.removeItem)

  return (
    <div
      x-node-id={itemId}
      className={classNames.join(' ')}
      onClick={onClick}
      title={JSON.stringify(
        item,
        (key, value) => (key === 'location' ? undefined : value),
        2
      )}>
      <div className={emojiClassNames.join(' ')}>{item.emoji}</div>
      <div className={typeClassNames.join(' ')}>{item.type}</div>
      <div className={idClassNames.join(' ')}>{itemId}</div>
      <div
        className={deleteClassNames.join(' ')}
        onClick={e => {
          e.stopPropagation()
          removeItem(itemId)
        }}>
        🗑️
      </div>
      <ItemDetails onClick={onClick} item={item} itemId={itemId} />
    </div>
  )
})

const deleteClassNames = [
  'absolute',
  'bottom-0',
  'right-0',
  'p-1',
  'text-[0.6rem]',
  'cursor-pointer',
  'opacity-15',
  'hover:opacity-100',
  'transition-opacity',
]

const classNames = [
  'transition-all',
  'duration-1000',
  'pt-6',
  'w-32',
  'overflow-clip',
  'text-[0.75rem]',
  'leading-0',
  'border',
  'border-zinc-700',
  'rounded',
  'aspect-square',
  'flex-shrink-0',
  'relative',
  'shadow-md',
  'hover:shadow-sm',
  'shadow-zinc-900',
  'hover:shadow-zinc-500',
]

const typeClassNames = [
  'absolute',
  'top-[0.05rem]',
  'left-[1.4rem]',
  'p-1',
  'text-[0.6rem]',
  'uppercase',
  'tracking-[0.22rem]',
  'text-zinc-500',
  'font-extralight',
]

const emojiClassNames = [
  'absolute',
  'top-[-0.15rem]',
  'left-[0.1rem]',
  'p-1',
  'text-[0.75rem]',
]

const idClassNames = [
  'absolute',
  'top-0',
  'right-0',
  'p-1',
  'text-[0.25rem]',
  'uppercase',
  'text-zinc-700',
]

export default Item
