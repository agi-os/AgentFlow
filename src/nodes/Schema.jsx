import { Handle, Position } from '@xyflow/react'
import classNames from './classNames'
import Pre from '../components/Pre'

const SchemaNode = ({ id, data }) => {
  return (
    <div className={classNames.join(' ')}>
      <div>Schema node [{id}]</div>
      <Pre>{data.schema}</Pre>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default SchemaNode
