import Title from '../../components/Title'
import SignalHandles from '../../signals/handle'
import { BeltSource, BeltTarget } from '../../components/BeltPort'
import ZoomCompensated from '../ZoomCompensated/index'
import Semaphore from '../../components/Semaphore'
import AddItemButton from './AddItemButton'

import ZoomResponsiveWrapper from '../ZoomCompensated/ZoomResponsiveWrapper'
import baseClassNames from './classNames'

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
          <AddItemButton />
          <div className="flex flex-row flex-wrap gap-1">
            {data?.items?.map((item, index) => (
              <div
                key={index}
                x-id={item.id}
                className={dataItemClassNames.join(' ')}>
                {item.emoticon}
              </div>
            ))}
          </div>
        </ZoomResponsiveWrapper>
      </ZoomCompensated>
      <BeltSource />
    </div>
  )
}

const zoomResponsiveWrapperClassNames = ['flex', 'flex-col', 'gap-2', 'p-2']

const dataItemClassNames = [
  'w-10',
  'h-10',
  'border-zinc-700',
  'border',
  'rounded-lg',
  'flex',
  'items-center',
  'justify-center',
]

export default ItemChestNode
