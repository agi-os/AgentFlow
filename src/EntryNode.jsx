import { useState } from 'react'
import { Position, Handle, useReactFlow } from '@xyflow/react'

const TextNode = ({ id, data }) => {
  const { updateNodeData } = useReactFlow()
  const [text, setText] = useState(data.text)
  const updateText = text => {
    // avoid jumping caret with a synchronous update
    setText(text)
    // update actual node data
    updateNodeData(id, { text })
  }
  const classNames = [
    'text-xs',
    'border',
    'border-[#444]',
    'px-2',
    'py-3',
    'text-white',
    'bg-[#222]',
    'rounded',
    'hover:border-[#666]',
  ]

  const inputClassNames = [
    'w-full',
    'p-1',
    'border',
    'border-[#222]',
    'bg-[#111]',
    'rounded',
  ]

  return (
    <div className={classNames.join(' ')}>
      <div>Content node [{id}]</div>
      <div>
        <input
          className={inputClassNames.join(' ')}
          onChange={event => updateText(event.target.value)}
          value={text}
        />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default TextNode
