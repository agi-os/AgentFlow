import { useInView } from 'react-intersection-observer'
import { useStore } from '@xyflow/react'
import IdBadge from '../../components/IdBadge'
import SuperZoom from './SuperZoom'

const InViewContent = ({ item }) => {
  // Get the current zoom level
  const zoomLevel = useStore(s => s.transform[2])

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.01,
  })

  // Sanity check
  if (!item) return null

  return (
    <div x-id={item.id} ref={ref} className="absolute inset-0">
      {inView && zoomLevel > 9 ? (
        <SuperZoom item={item} />
      ) : (
        <IdBadge outline={false}>{item?.jobType?.substring(0, 7)}</IdBadge>
      )}
    </div>
  )
}

export default InViewContent
