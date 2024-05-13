import Title from '../../components/Title'
import SignalHandles from '../../signals/handle'
import { BeltSource, BeltTarget } from '../../components/BeltPort'
import ZoomCompensated from '../ZoomCompensated/index'
import { ChestView } from './ChestView'
import Semaphore from '../../components/Semaphore'

/**
 * Renders a Chest node component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.id - The unique identifier of the Chest node.
 * @param {Object} props.data - The data associated with the Chest node.
 * @returns {JSX.Element} The rendered Chest node component.
 */
const ChestNode = props => {
  return (
    <div className={classNames.join(' ')}>
      <BeltTarget />
      <SignalHandles />
      <Title id={props.id}>🗄️ Chest</Title>
      <Semaphore />
      <ZoomCompensated
        classNames={['mt-6', 'overflow-x-hidden', 'overflow-y-auto']}>
        <ChestView {...props} />
      </ZoomCompensated>
      <BeltSource />
    </div>
  )
}

const classNames = [
  'p-1',
  'rounded',
  'text-zinc-300',
  'font-thin',
  'bg-zinc-800',
  'w-96',
  'h-96',
  'border-[1px]',
  'border-zinc-700',
  'overflow-hidden',
]

export default ChestNode
