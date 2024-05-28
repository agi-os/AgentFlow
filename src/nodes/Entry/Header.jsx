import SignalHandles from '../../signals/SignalHandles'
import Semaphore from '../../components/Semaphore'
import Title from '../../components/Title'
import { useNodeId } from '@xyflow/react'

const Header = () => {
  const id = useNodeId()

  return (
    <>
      <Semaphore />
      <Title id={id}>✏️ Manual Entry</Title>
      <SignalHandles />
    </>
  )
}

export default Header
