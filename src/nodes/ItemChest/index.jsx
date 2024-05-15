import Title from '../../components/Title'
import SignalHandles from '../../signals/handle'
import { BeltSource, BeltTarget } from '../../components/BeltPort'
import ZoomCompensated from '../ZoomCompensated/index'
import Semaphore from '../../components/Semaphore'
import AddItemButton from './AddItemButton'

import {
  useReactFlow,
  useStore,
  NodeResizer,
  useStoreApi,
  useNodeId,
} from '@xyflow/react'
import ZoomResponsiveWrapper from '../ZoomCompensated/ZoomResponsiveWrapper'

/**
 * Renders a Chest node component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.id - The unique identifier of the Chest node.
 * @param {Object} props.data - The data associated with the Chest node.
 * @returns {JSX.Element} The rendered Chest node component.
 */
const ItemChestNode = props => {
  // Get the handles on necessary data and functions from the store.
  const store = useStore()
  const storeApi = useStoreApi()
  const reactFlow = useReactFlow()

  return (
    <div className={classNames.join(' ')}>
      <BeltTarget />
      <SignalHandles />
      <Title id={props.id}>📦 Item Chest</Title>
      <Semaphore />
      <ZoomCompensated classNames={['mt-6', 'overflow-hidden']}>
        <ZoomResponsiveWrapper classNames={zoomResponsiveWrapperClassNames}>
          <AddItemButton />
          <div className="flex flex-row flex-wrap gap-1">
            {props?.data?.items?.map((item, index) => (
              <div
                key={index}
                x-id={item.id}
                className="w-10 h-10 border-zinc-700 border rounded-lg flex items-center justify-center">
                {item.emoticon}
              </div>
            ))}
          </div>
        </ZoomResponsiveWrapper>
      </ZoomCompensated>
      <BeltSource />
      {/* <NodeResizer minWidth={100} minHeight={30} /> */}
    </div>
  )
}

const zoomResponsiveWrapperClassNames = ['flex', 'flex-col', 'gap-2', 'p-2']

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

export default ItemChestNode
