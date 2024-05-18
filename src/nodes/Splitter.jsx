import classNames from '../constants/classNames'
import Title from '../components/Title'
import Pre from '../components/Pre'
import Semaphore from '../components/Semaphore'

import SignalHandles from '../signals/SignalHandles/index'
import { BeltTarget, BeltSource } from '../components/BeltPort'

/**
 * Splitter is a node that splits incoming data and immediately outputs it on different output paths.
 * @param {string} id - Node ID
 * @param {object} data - Node data
 * @returns {JSX.Element}
 */
const SplitterNode = ({ id, data }) => {
  return (
    <div className={classNames.join(' ')}>
      <BeltTarget />
      <Semaphore />
      <SignalHandles />
      <Title id={id}>🔀 Splitter</Title>
      <Pre>{data}</Pre>
      <BeltSource style={{ left: '30%' }} id="outbox" />
      <BeltSource style={{ left: '70%' }} id="outbox2" />
    </div>
  )
}

export default SplitterNode
