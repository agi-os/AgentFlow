import { useState } from 'react'
import { Position, Handle, useReactFlow } from '@xyflow/react'
import Input from '../components/Input'
import classNames from './classNames'

/**
 * Text entry node
 * @param {string} id - Node ID
 * @param {object} data - Node data
 * @returns {JSX.Element}
 */
const EntryNode = ({ id, data }) => {
  const { updateNodeData } = useReactFlow()

  const [text, setText] = useState(data.text)

  const updateText = text => {
    // avoid jumping caret with a synchronous update
    setText(text)
    // update actual node data
    updateNodeData(id, { text })
  }

  return (
    <div className={classNames.join(' ')}>
      <div>Content node [{id}]</div>
      <Input updateText={updateText} text={text} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default EntryNode
