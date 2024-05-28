import classNames from '../constants/classNames'
import Title from '../components/Title'
import Pre from '../components/Pre'

import SignalHandles from '../signals/SignalHandles'

/**
 * Constant combinator is a node that outputs constant values on output signals.
 * @param {string} id - Node ID
 * @param {object} data - Node data
 * @returns {JSX.Element}
 */
const ConstantCombinatorNode = ({ id, data }) => {
  return (
    <div className={classNames.join(' ')}>
      <SignalHandles />
      <Title id={id}>🔢 Constant Combinator</Title>
      <Pre>{data}</Pre>
    </div>
  )
}

export default ConstantCombinatorNode
