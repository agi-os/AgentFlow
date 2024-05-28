import Title from '../../components/Title'
import SignalHandles from '../../signals/SignalHandles'
import { BeltSource, BeltTarget } from '../../components/BeltPort'
import ZoomCompensated from '../ZoomCompensated/index'
import Semaphore from '../../components/Semaphore'

import ZoomResponsiveWrapper from '../ZoomCompensated/ZoomResponsiveWrapper'
import baseClassNames from './classNames'

import ChestBody from './ChestBody'
import { useStore } from '@xyflow/react'

import Countdown from './Countdown'

import useSelectedClassNames from '../../hooks/useSelectedClassNames'

/**
 * Renders a Chest node component.
 * @param {Object} props - The component props.
 * @param {string} props.id - The unique identifier of the Chest node.
 * @param {Object} props.data - The data associated with the Chest node.
 * @returns {JSX.Element} The rendered Chest node component.
 */
const ItemChestNode = ({ id }) => {
  // Get the number of items in the chest
  const itemCount = useStore(
    store => store.itemLocationLookup?.get(id)?.length || 0
  )

  // Get the selected class names
  const selectedClassNames = useSelectedClassNames()

  // Combine the base and selected class names
  const classNames = [...baseClassNames, ...selectedClassNames]

  return (
    <div x-node-id={id} className={classNames.join(' ')}>
      <BeltTarget />
      <Title id={id}>📦 Item Chest ({itemCount})</Title>
      <Semaphore />
      <ZoomCompensated classNames={['mt-6', 'overflow-hidden']}>
        <ZoomResponsiveWrapper>
          <ChestBody />
        </ZoomResponsiveWrapper>
      </ZoomCompensated>
      <BeltSource />
      <Countdown />
      <SignalHandles />
    </div>
  )
}

export default ItemChestNode
