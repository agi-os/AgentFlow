import IdBadge from '../../components/IdBadge'
import SuperZoom from './SuperZoom'
// React.forwardRef()
// const DivItem = (item, divRef, ref, inView, zoomLevel) => {

import React from 'react'

const DivItem = React.forwardRef(({ item, divRef, inView, zoomLevel }, ref) => {
  const classNames = [
    'grid',
    'place-items-center',
    'w-10',
    'h-10',
    'relative',
    'rounded-full',
    'bg-zinc-900',
    'border',
    'border-zinc-900',
    'bg-opacity-85',
    '-top-5',
    '-left-5',
    'shadow-inner',
    'shadow-zinc-800',
  ]

  return (
    <div
      x-id={item.id}
      ref={divRef}
      xmlns="http://www.w3.org/1999/xhtml"
      className={classNames.join(' ')}>
      <div x-id={item.id} className="relative -top-0.5">
        {item.emoticon}
      </div>
      <div x-id={item.id} ref={ref} className="absolute inset-0">
        {inView && (
          <>
            {zoomLevel > 9 ? (
              <SuperZoom item={item} />
            ) : (
              <IdBadge outline={false}>{item.jobType.substring(0, 7)}</IdBadge>
            )}
          </>
        )}
      </div>
    </div>
  )
})

export default DivItem
