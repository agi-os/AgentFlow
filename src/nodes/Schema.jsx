import { Handle, Position } from '@xyflow/react'
import classNames from './classNames'

import Pre from '../components/Pre'
import Title from '../components/Title'

const SchemaNode = ({ id, data }) => {
  return (
    <div className={classNames.join(' ')}>
      <Title id={id}>Schema node</Title>
      <Pre>{data.schema}</Pre>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default SchemaNode