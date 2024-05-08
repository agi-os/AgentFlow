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

import { SourceSignalHandles } from '../signals/handle'
import { Fragment } from 'react'

/**
 * Constant combinator is a node that outputs constant values on output signals.
 * @param {string} id - Node ID
 * @param {object} data - Node data
 * @returns {JSX.Element}
 */
const ConstantCombinatorNode = ({ id, data }) => {
  return (
    <div className={classNames.join(' ')}>
      <SourceSignalHandles />
      <Title id={id}>🔢 Constant Combinator</Title>
      <Pre>{data}</Pre>
    </div>
  )
}

export default ConstantCombinatorNode
