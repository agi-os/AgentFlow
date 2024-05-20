import Title from '../../components/Title'
import SignalHandles from '../../signals/SignalHandles/index'
import { BeltSource, BeltTarget } from '../../components/BeltPort'
import ZoomCompensated from '../ZoomCompensated/index'
import Semaphore from '../../components/Semaphore'

import ZoomResponsiveWrapper from '../ZoomCompensated/ZoomResponsiveWrapper'
import baseClassNames from './classNames'

import ChestBody from './ChestBody'
import { useStore } from '@xyflow/react'

import Countdown from './Countdown'

/**
 * Renders a Chest node component.
 * @param {Object} props - The component props.
 * @param {string} props.id - The unique identifier of the Chest node.
 * @param {Object} props.data - The data associated with the Chest node.
 * @returns {JSX.Element} The rendered Chest node component.
 */
const ItemChestNode = ({ id, selected }) => {
  // Get the number of items in the chest
  const itemCount = useStore(
    store => store.itemLocationLookup?.get(id)?.length || 0
  )

  const tickCounter = useStore(s => s.tickCounter)

  // Prepare the class names based on the selected state
  const selectedClassNames = selected
    ? ['outline-offset-8', 'outline-2']
    : ['outline-offset-0', 'outline-0']

  // Combine the base and selected class names
  const classNames = [...baseClassNames, ...selectedClassNames]

  return (
    <div x-id={id} className={classNames.join(' ')}>
      <BeltTarget />
      <SignalHandles />
      <Title id={id}>📦 Item Chest ({itemCount})</Title>
      <Semaphore />
      <ZoomCompensated classNames={['mt-6', 'overflow-hidden']}>
        <ZoomResponsiveWrapper>
          <ChestBody />
        </ZoomResponsiveWrapper>
      </ZoomCompensated>
      <BeltSource />
      <Countdown />
    </div>
  )
}

export default ItemChestNode
