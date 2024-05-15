import Title from '../../components/Title'
import SignalHandles from '../../signals/handle'
import { BeltSource, BeltTarget } from '../../components/BeltPort'
import ZoomCompensated from '../ZoomCompensated/index'
import Semaphore from '../../components/Semaphore'

import ZoomResponsiveWrapper from '../ZoomCompensated/ZoomResponsiveWrapper'
import baseClassNames from './classNames'

import ChestBody from './ChestBody'

/**
 * Renders a Chest node component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.id - The unique identifier of the Chest node.
 * @param {Object} props.data - The data associated with the Chest node.
 * @returns {JSX.Element} The rendered Chest node component.
 */
const ItemChestNode = ({ id, data, selected }) => {
  // Get all data about this node possibly from the store
  // const node = useInternalNode(id)

  // console.log({ node })

  // Prepare the class names based on the selected state
  const selectedClassNames = selected
    ? ['outline-orange-700']
    : ['outline-transparent']

  // Combine the base and selected class names
  const classNames = [...baseClassNames, ...selectedClassNames]

  return (
    <div className={classNames.join(' ')}>
      <BeltTarget />
      <SignalHandles />
      <Title id={id}>📦 Item Chest</Title>
      <Semaphore />
      <ZoomCompensated classNames={['mt-6', 'overflow-hidden']}>
        <ZoomResponsiveWrapper classNames={zoomResponsiveWrapperClassNames}>
          <ChestBody data={data} />
        </ZoomResponsiveWrapper>
      </ZoomCompensated>
      <BeltSource />
    </div>
  )
}

const zoomResponsiveWrapperClassNames = [] //['flex', 'flex-col', 'gap-2', 'p-2']

export default ItemChestNode
