import Title from '../../components/Title'
import SignalHandles from '../../signals/handle'
import { BeltSource, BeltTarget } from '../../components/BeltPort'
import ZoomCompensated from '../ZoomCompensated/index'
import { ChestView } from './ChestView'
import Semaphore from '../../components/Semaphore'

const classNames = [
  'p-1',
  'rounded',
  'bg-zinc-700',
  'w-96',
  'h-96',
  'overflow-hidden',
].join(' ')

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
    <div className={classNames}>
      <BeltTarget />
      <SignalHandles />
      <Title id={props.id}>🗄️ Chest</Title>
      <Semaphore />
      <div className="absolute inset-2 mt-10 overflow-clip rounded-md">
        <ZoomCompensated>
          <ChestView {...props} />
        </ZoomCompensated>
      </div>
      <BeltSource />
    </div>
  )
}

export default ChestNode
