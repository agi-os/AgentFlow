import React from 'react'
import { useStore } from '@xyflow/react'

const Item = React.memo(({ itemId }) => {
  const item = useStore(state => state.getItem(itemId))
  const removeItem = useStore(state => state.removeItem)

  return (
    <div x-id={itemId} className={classNames.join(' ')}>
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
      <div className={innerClassNames.join(' ')}>
        {Object.keys(item)
          .filter(key => !['type', 'emoji', 'id', 'location'].includes(key))
          .map(key => [
            <div x-id={itemId} key={key}>
              {key}
            </div>,
            <div x-id={itemId} key={key + 'v'}>
              {typeof item[key] === 'object' && item[key] !== null
                ? Object.entries(item[key]).map(([subKey, subValue]) => (
                    <div key={subKey}>
                      {subKey}: {subValue}
                    </div>
                  ))
                : item[key]}
            </div>,
          ])}
      </div>
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

const innerClassNames = [
  'border-t',
  'border-zinc-700',
  'grid',
  'grid-cols-[1fr,2fr]',
  'gap-1',
  'p-2',
  'text-[0.5rem]',
]

const typeClassNames = [
  'absolute',
  'top-[0.05rem]',
  'left-[1.4rem]',
  'p-1',
  'text-[0.6rem]',
  'uppercase',
  'tracking-[0.21rem]',
  'text-zinc-400',
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
