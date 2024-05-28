import classNames from '../constants/classNames'
import Title from '../components/Title'
import Pre from '../components/Pre'

import SignalHandles from '../signals/SignalHandles'

/**
 * Arithmetic combinator is a node that performs arithmetic operations on input signals and outputs the result on output signals.
 * @param {string} id - Node ID
 * @param {object} data - Node data
 * @returns {JSX.Element}
 */
const ArithmeticCombinator = ({ id, data }) => {
  return (
    <div className={classNames.join(' ')}>
      <SignalHandles />
      <Title id={id}>✳️ Arithmetic Combinator</Title>
      <Pre>{data}</Pre>
    </div>
  )
}

export default ArithmeticCombinator
