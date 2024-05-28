import { useStore } from '@xyflow/react'
import { useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ZoomCompensated from '../nodes/ZoomCompensated'
import ZoomResponsiveWrapper from '../nodes/ZoomCompensated/ZoomResponsiveWrapper'

/**
 * Renders the details of an item.
 * @param {Object} props - The component props.
 * @param {Object} props.item - The item object containing details.
 * @param {string} props.itemId - The unique identifier for the item.
 * @param {string[]} props.classNames - The class names for the item details.
 * @returns {JSX.Element} The rendered item details component.
 */

const ItemDetails = ({
  itemId,
  classNames = [
    'border-t',
    'border-zinc-700',
    'grid',
    'grid-cols-[1fr,2fr]',
    'gap-x-2',
    'p-2',
    'text-[0.5rem]',
  ],
  onClick,
}) => {
  const zoom = useStore(store => store.transform[2])
  const item = useStore(store => store.getItem(itemId))
  const fontSize = zoom > 10 ? 100 - 3 * zoom + '%' : ''
  const [copySuccess, setCopySuccess] = useState('')

  const copyToClipboard = async e => {
    // Stop propagation to prevent the item from being selected.
    e.stopPropagation()
    setCopySuccess('')

    // Copy without the id and location properties.
    const copy = { ...item }
    delete copy.id
    delete copy.location

    try {
      await navigator.clipboard.writeText(JSON.stringify(copy))
      setCopySuccess('Copied!')
    } catch (err) {
      setCopySuccess('Failed to copy text')
    }
  }

  // Sanity check
  if (!item || !item.id) return null

  if (item.markdown) {
    return [
      <button
        className="absolute transition-all 
      right-0 top-0 p-2 text-[0.5rem] opacity-10 hover:opacity-100"
        key="copy"
        title="Copy to clipboard"
        onClick={copyToClipboard}>
        {copySuccess || '🗐'}
      </button>,
      <div
        key="main"
        onClick={e => {
          if (!onClick) return
          e.preventDefault()
          e.stopPropagation()
          onClick()
        }}
        className={[
          ...classNames,
          '!block',
          'text-[0.3rem]',
          'leading-tight',
        ].join(' ')}
        style={{ fontSize }}>
        <Markdown remarkPlugins={[remarkGfm]}>{item.markdown}</Markdown>
      </div>,
    ]
  }

  // Render regular content if not large
  return [
    <button
      className="absolute transition-all 
    right-0 top-0 p-2 text-[0.5rem] opacity-10 hover:opacity-100"
      key="copy"
      title="Copy to clipboard"
      onClick={copyToClipboard}>
      {copySuccess || '🗐'}
    </button>,
    <div
      x-node-id={itemId}
      key="main"
      className={classNames.join(' ')}
      style={{ fontSize }}>
      {Object.keys(item)
        .filter(key => !['type', 'emoji', 'id', 'location'].includes(key))
        .map(key => [
          <div x-node-id={itemId} key={key}>
            {key}
          </div>,
          <div x-node-id={itemId} key={key + 'v'}>
            {typeof item[key] === 'object' && item[key] !== null
              ? Object.entries(item[key]).map(([subKey, subValue]) => (
                  <div key={subKey}>
                    {subKey}: {subValue}
                  </div>
                ))
              : item[key]}
          </div>,
        ])}
    </div>,
  ]
}

export default ItemDetails
